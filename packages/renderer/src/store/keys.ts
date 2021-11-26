import _ from 'lodash'
import {defineStore} from 'pinia'
import type {Key, Keys, KeysResult} from '../../types/redis'
import {useRedis} from '/@/use/redis'
import {useToaster} from '/@/use/toaster'
import {useTtlTimer} from '/@/use/ttlTimer'

const redis = useRedis()
const toaster = useToaster()
const {clearTtlTimer, registerTtlTimer} = useTtlTimer()

interface KeysLoadResult {
  result: KeysResult
  wasCancelled: boolean,
  lastLoad: number,
  loaded: number,
}

interface State {
  list: Keys,
  cursor: number,
  selected: string | undefined,
  pattern: string,
}

export const useKeysStore = defineStore('keys', {
  state: (): State => ({
    list: {},
    cursor: 0,
    selected: undefined,
    pattern: '*',
  }),
  getters: {
    withTTL(state) {
      return _.filter(state.list, key => key.ttl > -1)
    },
    current(state) {
      return _.find(state.list, {name: state.selected})
    },
  },
  actions: {
    setKeys(keys: Keys) {
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
      clearTtlTimer()
      registerTtlTimer()
    },
    async loadKeys(pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0): Promise<KeysLoadResult> {
      registerTtlTimer()

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
      // TODO
      await redis.client.multiExecutor([
        {
          args: ['lset', keyName, String(index), 'REDIS-GUI--DELETED--'],
        },
        {
          args: ['lrem', keyName, '0', 'REDIS-GUI--DELETED--'],
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
  },
})
