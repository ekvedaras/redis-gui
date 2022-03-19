import {useRedis} from '/@/use/redis'
import {parseInt} from 'lodash'
import {defineStore} from 'pinia'
import type {Database} from '../../types/models';
import {useKeysStore} from '/@/store/keys';

interface State {
  list: Array<Database>,
  total: number,
  selected: number | null,
  infoAllowed: boolean,
}

export const useDatabasesStore = defineStore('databases', {
  state: (): State => ({
    list: [],
    total: 0,
    selected: null,
    infoAllowed: true,
  }),
  actions: {
    load() {
      const redis = useRedis()

      return Promise.all([
        redis.client.configGet('databases')
          .then(({databases}: { databases: string }) => this.total = parseInt(databases))
          .catch(() => this.total = 16),
        redis.client.info('keyspace').then((result: string) => {
          this.list = []
          result.split('\n').slice(1, -1).forEach((db: string) => {
            let key, value;

            const [id, meta] = db.split(':')
            const database: Database = {id, index: parseInt(id.replace('db', ''))}

            meta.split(',').forEach(param => {
              [key, value] = param.split('=')
              database[key] = value
            })

            this.list[database.index] = database
          })
        }).catch((error: unknown) => {
          if (String(error).includes('NOPERM')) {
            this.infoAllowed = false
            this.list.push({
              avg_ttl: '?',
              expires: '?',
              id: 'db0',
              index: 0,
              keys: '?',
            })
          } else {
            throw error
          }
        }),
      ])
    },
    async select(index: number) {
      const keysStore = useKeysStore()
      const redis = useRedis()

      await redis.client.select(index)

      this.selected = index
      keysStore.selected = undefined
      keysStore.loadKeys()
    },
  },
})
