import _ from 'lodash'
import {defineStore} from 'pinia'
import type {Key, KeysResult} from '../../types/redis'
import {useRedis} from '/@/use/redis'
import {useToaster} from '/@/use/toaster'

const redis = useRedis()
const toaster = useToaster()

interface KeysLoadResult {
  result: KeysResult
  wasCancelled: boolean,
  lastLoad: number,
  loaded: number,
}

interface State {
  list: Record<string, Key>,
  loading: boolean,
  cursor: number,
  selected: string | undefined,
  pattern: string,
  ttlTimer: NodeJS.Timer | undefined,
}

export const useKeysStore = defineStore('keys', {
  state: (): State => ({
    list: {},
    loading: false,
    cursor: 0,
    selected: undefined,
    pattern: '*',
    ttlTimer: undefined,
  }),
  getters: {
    withTTL(state) {
      return _.filter(state.list, key => key.ttl > -1)
    },
    current(state) {
      return _.find(state.list, {name: state.selected})
    },
    hasKeys(state) {
      return Object.keys(state.list).length > 0
    },
  },
  actions: {
    setKeys(keys: Record<string, Key>) {
      this.list = _(keys).toPairs().sortBy(0).fromPairs().value()
    },
    addKey(key: Key) {
      this.list = _({...this.list, [key.name]: key}).toPairs().sortBy(0).fromPairs().value()
    },
    removeKey(key: Key) {
      delete this.list[key.name]
      this.refreshTTL()
    },
    refreshTTL() {
      this.clearTtlTimer()
      this.registerTtlTimer()
    },
    async loadKeys(pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0): Promise<KeysLoadResult> {
      this.loading = true
      this.registerTtlTimer()

      if (pattern === '**') {
        pattern = '*'
      }

      if (!cursor) {
        this.pattern = pattern
      }

      const loadResult = await redis.keys(pattern, limit, cursor).then(result => {
        if (pattern === this.pattern) {
          this.cursor = result.nextCursor
          this.list = cursor ? {...this.list, ...result.keys} : result.keys
        }

        return {
          result,
          wasCancelled: false,
          lastLoad: Object.keys(result.keys).length,
          loaded: 0,
        }
      })

      if (loadResult.result.nextCursor && lastLoad + loadResult.lastLoad < limit && pattern === this.pattern) {
        return this.loadKeys(pattern, loadResult.result.nextCursor, limit, lastLoad + loadResult.lastLoad)
      }

      loadResult.wasCancelled = pattern !== this.pattern
      loadResult.loaded = loadResult.lastLoad + lastLoad

      this.loading = false

      return loadResult
    },
    async loadKeyInfo(name: string, cursor = 0): Promise<KeysResult> {
      const result = await redis.keys(name, redis.pageSize, cursor);
      if (Object.prototype.hasOwnProperty.call(result.keys, name)) {
        this.list[name] = result.keys[name]
        result.nextCursor = 0
      }

      if (result.nextCursor) {
        this.loadKeyInfo(name, result.nextCursor)
      }

      return result
    },
    async deleteKey(name: string): Promise<void> {
      await redis.client.del(name)

      if (this.selected === name) {
        this.selected = undefined
      }

      delete this.list[name]
    },
    async deleteListItem(keyName: string, index: number): Promise<void> {
      await redis.client.multiExecutor([
        {
          args: ['lSet', keyName, String(index), 'REDIS-GUI--DELETED--'],
        },
        {
          args: ['lRem', keyName, '0', 'REDIS-GUI--DELETED--'],
        },
      ]);

      toaster.info(`${keyName} list item at ${index} position deleted`)
    },
    async deleteSetItem(keyName: string, value: string): Promise<void> {
      await redis.client.sRem(keyName, value)
      toaster.info(`${keyName} set item deleted`)
    },
    async deleteZsetItem(keyName: string, value: string): Promise<void> {
      await redis.client.zRem(keyName, value)
      toaster.info(`${keyName} sorted set item deleted`)
    },
    async deleteHashItem(keyName: string, key: string): Promise<void> {
      await redis.client.hDel(keyName, key)
      toaster.info(`${keyName} hash ${key} key deleted`)
    },
    tick() {
      return Object
        .values(this.withTTL)
        .forEach(key => {
          this.list[key.name].ttl--
          if (this.list[key.name].ttl <= 0) {
            if (this.selected === key.name) {
              this.selected = undefined
            }

            delete this.list[key.name]

            toaster.info(`Key ${key.name} has expired`)
          }
        })
    },
    registerTtlTimer() {
      if (this.ttlTimer) {
        return
      }

      this.ttlTimer = setInterval(this.tick, 1000)
    },
    clearTtlTimer() {
      if (!this.ttlTimer) {
        return
      }

      clearInterval(this.ttlTimer)
      this.ttlTimer = undefined
    },
  },
})
