import {useDatabase} from '/@/use/database'
import type {KeysResult, Redis} from '../../types/redis'
import {useToaster} from '/@/use/toaster'
import type {Server} from '../../types/database'
import type {RedisClientOptions, RedisClientType} from '@node-redis/client/dist/lib/client'
import {pickBy} from 'lodash'
import {useServersStore} from '/@/store/servers';

const database = useDatabase()
const toaster = useToaster()

export function useRedis(): Redis {
  const pageSize = database.data.settings.itemsPerPage

  return {
    pageSize,
    namespaceSeparator: database.data.settings.namespaceSeparator,
    client: window.redisApi.client,
    async connect(server, options): Promise<RedisClientType> {
      const serversStore = useServersStore()
      serversStore.connected = false
      serversStore.connectingTo = server
      serversStore.connecting = true

      if (database.data.servers[server].ssh.tunnel) {
        await window.redisApi.createClientThroughSsh(
          server,
          {
            ...database.data.servers[server].ssh,
            privateKey: database.data.servers[server].ssh.privateKey || `${window.fsApi.homedir}/.ssh/id_rsa`,
          },
          this.buildConnectionConfig(database.data.servers[server]),
        )
      } else {
        window.redisApi.createClient(
          server,
          this.buildConnectionConfig(database.data.servers[server]),
        )
      }


      this.client.on('ready', () => {
        toaster.info('Connected')
        serversStore.connecting = false
        serversStore.connected = true
        options?.onReady && options.onReady()
      }).on('error', (error: unknown) => {
        if (serversStore.connectingTo === server) {
          toaster.error(String(error))
          serversStore.connecting = false
          serversStore.connected = false
        }
      }).on('reconnecting', () => {
        if (serversStore.connectingTo === server) {
          serversStore.connecting = true
          serversStore.connected = false
        }
      })

      await this.client.connect()

      return this.client
    },
    buildConnectionConfig(config: Server): RedisClientOptions<Record<string, never>, Record<string, never>> {
      return pickBy({
        url: config.url,
        username: config.username,
        password: config.password,
        socket: {
          host: config.host,
          port: config.port,
          reconnectStrategy(retries: number): number | Error {
            if (retries > 10) {
              return new Error('Retry limit exceeded')
            }

            return 1000
          },
          ...(config.ssl ? {tls: true} : {}),
        },
      }, v => v !== undefined)
    },
    async disconnect(): Promise<void> {
      await this.client.quit()
    },
    keys: async function (pattern = '*', limit = pageSize, cursor = 0): Promise<KeysResult> {
      if (!this.client) {
        return Promise.reject(new Error('Redis client is not connected'))
      }

      const result: KeysResult = {
        nextCursor: 0,
        keys: {},
      }

      const scanResult = await this.client.scan(cursor, {MATCH: pattern})
      result.nextCursor = scanResult.cursor

      for await (const key of scanResult.keys) {
        result.keys[key] = {
          encoding: '',
          name: key,
          ttl: -1,
          type: '',
        }

        if (Object.keys(result.keys).length >= limit) {
          break
        }
      }

      await Promise.all(
        scanResult.keys.map((key: string) => [
          this.client?.type(key).then((type: string) => {
            result.keys[key].type = type
          }),
          this.client?.ttl(key).then((ttl: number) => {
            result.keys[key].ttl = ttl
          }),
          this.client?.sendCommand(['object', 'encoding', key]).then((encoding: string | null) => {
            result.keys[key].encoding = encoding?.toString() ?? ''
          }),
        ]).flat(),
      )

      return result
    },
  }
}
