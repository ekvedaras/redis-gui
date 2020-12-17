import _ from 'lodash'
import { clearTtlTimer, registerTtlTimer } from '@/services/ttlTimer'
import Vue from 'vue'
import { redis } from '@/services/redis'

export default {
  namespaced: true,
  state: {
    list: {},
    cursor: 0,
    selected: undefined,
    pattern: '*',
  },
  getters: {
    withTTL: state => _.filter(state.list, key => key.ttl > -1),
    current: state => _.find(state.list, { name: state.selected }),
  },
  mutations: {
    setPattern(state, pattern) {
      state.pattern = pattern
    },
    setKeys (state, keys) {
      state.list = _.sortKeysBy(keys)
    },
    addKey (state, key) {
      state.list = _.sortKeysBy({ ...state.list, [key.name]: key })
    },
    updateKey (state, key) {
      state.list[key.name] = key
    },
    setCursor (state, cursor) {
      state.cursor = cursor
    },
    select (state, key) {
      state.selected = key
    },
    unloadKey (state) {
      state.selected = undefined
    },
    removeKey (state, key) {
      Vue.delete(state.list, key.name)
      this.commit('keys/refreshTTL')
    },
    refreshTTL (state) {
      clearTtlTimer()
      registerTtlTimer({ state, store: this })
    },
  },
  actions: {
    loadKeys ({ commit, state, dispatch }, { pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0 } = {}) {
      registerTtlTimer({ state, store: this })

      if (pattern === '**') {
        pattern = '*'
      }

      if (!cursor) {
        commit('setPattern', pattern)
      }

      return redis.keys(pattern, limit, cursor).then(result => {
        result.lastLoad = Object.keys(result.keys).length

        if (pattern === state.pattern) {
          commit('setCursor', result.nextCursor)
          commit('setKeys', cursor ? { ...state.list, ...result.keys } : result.keys)
        }

        return result
      }).then(result => {
        if (result.nextCursor && lastLoad + result.lastLoad < limit && pattern === state.pattern) {
          return dispatch('loadKeys', { pattern, cursor: result.nextCursor, limit, lastLoad: lastLoad + result.lastLoad })
        }

        result.wasCancelled = pattern !== state.pattern
        result.loaded = result.lastLoad + lastLoad

        return result
      })
    },
    loadKeyInfo ({ commit, dispatch }, { name, cursor = 0 }) {
      return redis.keys(name, redis.pageSize, cursor).then(result => {
        if (Object.prototype.hasOwnProperty.call(result.keys, name)) {
          commit('updateKey', result.keys[name])
          result.nextCursor = 0
        }

        return result
      }).then(result => {
        if (result.nextCursor) {
          return dispatch('loadKeyInfo', { name, cursor: result.nextCursor })
        }

        return result
      })
    },
    deleteKey ({ state, commit }, name) {
      return redis.async('del', name).then(() => {
        if (state.selected === name) {
          commit('unloadKey')
        }

        commit('removeKey', { name })
      })
    },
    deleteListItem (store, { keyName, item }) {
      return redis.multi([
        ['lset', keyName, item.index, 'REDIS-GUI--DELETED--'],
        ['lrem', keyName, 0, 'REDIS-GUI--DELETED--'],
      ]).then(multi => multi.exec((error, replies) => {
        if (error) {
          throw error
        }

        return replies
      })).then(() => Vue.toasted.info(`${keyName} list item at ${item.index} position deleted`))
    },
    deleteSetItem (store, { keyName, item: value }) {
      return redis.async('srem', keyName, value).then(() => Vue.toasted.info(`${keyName} set item deleted`))
    },
    deleteZsetItem (store, { keyName, item: value }) {
      return redis.async('zrem', keyName, value).then(() => Vue.toasted.info(`${keyName} sorted set item deleted`))
    },
    deleteHashItem (store, { keyName, item: key }) {
      return redis.async('hdel', keyName, key).then(() => Vue.toasted.info(`${keyName} hash ${key} key deleted`))
    },
  },
}
