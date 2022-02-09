import {useDatabase} from '/@/use/database'
import type {KeysResult, Redis} from '../../types/redis'
import {useToaster} from '/@/use/toaster'
import type {Server} from '../../types/database'
import type {RedisClientOptions, RedisClientType} from '@node-redis/client/dist/lib/client';

const database = useDatabase()
const toaster = useToaster()

export function useRedis(): Redis {
  const pageSize = database.data.settings.itemsPerPage

  return {
    pageSize,
    namespaceSeparator: database.data.settings.namespaceSeparator,
    current: Object.keys(database.data.servers)[0] ?? 'default',
    client: window.redisApi.client,
    beSilent: false,
    async connect(server = 'default', options): Promise<RedisClientType> {
      this.current = server

      window.redisApi.createClient(
        this.buildConnectionConfig(database.data.servers[server]),
      )

      this.client.on('ready', () => {
        toaster.info('Connected')
        options?.onReady && options.onReady()
      }).on('error', (error: unknown) => {
        toaster.error('REDIS ERROR: ' + error)
      })

      await this.client.connect()

      return this.client
    },
    buildConnectionConfig(config: Server): RedisClientOptions<Record<string, never>, Record<string, never>> {
      // TODO: support ssh tunnel
      return {
        url: `redis://${config.host}:${config.port}`,
      }
    },
    async disconnect(): Promise<void> {
      await this.client.quit()
    },
    silently(): Redis {
      this.beSilent = true
      return this
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
