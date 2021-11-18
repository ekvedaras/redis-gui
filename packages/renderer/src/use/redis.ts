import set from 'lodash/set'
import {useDatabase} from '/@/use/database'
import type {AsyncResult, Redis, RedisClient} from '../../types/redis'
import {useToaster} from '/@/use/toaster'
import type {Server} from '../../types/database'
import type {Multi} from 'redis'

const database = useDatabase()
const toaster = useToaster()

export function useRedis(): Redis {
  const pageSize = database.data.settings.itemsPerPage

  return {
    pageSize,
    namespaceSeparator: database.data.settings.namespaceSeparator,
    current: Object.keys(database.data.servers)[0] ?? 'default',
    client: {},
    promises: {},
    beSilent: false,
    async connect(server = 'default', onReady = undefined): Promise<RedisClient> {
      if (server !== this.current) {
        Object.entries(this.client).forEach(([key, client]) => {
          if (!client.connected) {
            this.disconnect(key)
          }
        })
      }

      this.current = server

      if (this.client[server]) {
        return this.client[server]
      }

      const config: Server = database.data.servers[server]

      return this.client[server] = (await this.createClient(config))
        .on('ready', () => {
          toaster.info('Connected')
          onReady && onReady()
        })
        .on('error', error => {
          toaster.error('REDIS ERROR: ' + error)
        })
    },
    async createClient(config: Server): Promise<RedisClient> {
      if (config.ssh.tunnel) {
        try {
          const tunnel = await window.redisSsh.connect({
            ...config.ssh,
            privateKey: window.fsApi.readFileSync(config.ssh.privateKey || `${window.fsApi.homedir}/.ssh/id_rsa`),
          }, config)

          return tunnel.client.on('end', tunnel.close)
        } catch (error: unknown) {
          toaster.error(String(error))
          throw error
        }
      }

      return window.redisApi.createClient(config)
    },
    disconnect(server = 'default'): void {
      this.client[server] && this.client[server].quit(() => {
        this.client[server].end(true)
        delete this.client[server]
        delete this.promises[server]
      })
    },
    silently(): Redis {
      this.beSilent = true
      return this
    },
    async: async function (command: string, ...args): Promise<unknown> {
      const beSilent = this.beSilent
      this.beSilent = false

      await this.connect(this.current)

      if (!Object.prototype.hasOwnProperty.call(this.promises, this.current)) {
        this.promises[this.current] = {}
      }

      if (!Object.prototype.hasOwnProperty.call(this.promises[this.current], command)) {
        try {

          this.promises[this.current][command] = window.utilApi.promisify(this.client[this.current][command]).bind(this.client[this.current])
        } catch (e) {
          return Promise.reject('Invalid redis command')
        }
      }

      return this.promises[this.current][command](...args).catch((error: unknown) => {
        if (!beSilent) toaster.error(String(error))
        throw error
      })
    },
    async multi(args): Promise<Multi> {
      await this.connect(this.current)

      return this.client[this.current].multi(args)
    },
    keys(pattern = '*', limit = pageSize, cursor = 0) {
      return this.async('scan', cursor, 'match', pattern, 'count', limit).then(async (result) => {
        const results = result as AsyncResult
        const keys = {
          nextCursor: parseInt(results[0]),
          keys: {},
        }

        if (!results[1]) {
          return keys
        }

        await Promise.all(results[1].map((key: string) => this.async('type', key))).then(types => {
          types.forEach((type, index) => {
            const name = (results[1] as string[])[index].replaceAll('.', '◦')
            set(keys.keys, `${name}.name`, name)
            set(keys.keys, `${name}.type`, type)
          })
        })

        await Promise.all(results[1].map((key: string) => this.async('ttl', key))).then(ttls => {
          ttls.forEach((ttl, index) => {
            const name = (results[1] as string[])[index].replaceAll('.', '◦')
            set(keys.keys, `${name}.name`, name)
            set(keys.keys, `${name}.ttl`, ttl)
          })
        })

        await Promise.all(results[1].map((key: string) => this.async('object', 'encoding', key))).then(encodings => {
          encodings.forEach((encoding, index) => {
            const name = (results[1] as string[])[index].replaceAll('.', '◦')
            set(keys.keys, `${name}.name`, name)
            set(keys.keys, `${name}.encoding`, encoding)
          })
        })

        return keys
      })
    },
  }
}
