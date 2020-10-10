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
  },
  getters: {
    withTTL: state => _.filter(state.list, key => key.ttl > -1),
    current: state => _.find(state.list, { name: state.selected }),
  },
  mutations: {
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

      return redis.keys(pattern, limit, cursor).then(result => {
        result.lastLoad = Object.keys(result.keys).length

        commit('setCursor', result.nextCursor)
        commit('setKeys', result.keys = cursor ? { ...state.keys, ...result.keys } : result.keys)

        return result
      }).then(result => {
        if (result.nextCursor && lastLoad + result.lastLoad < limit) {
          return dispatch('loadKeys', { pattern, cursor: result.nextCursor, limit, lastLoad: lastLoad + Object.keys(result.keys).length })
        }

        return result
      })
    },
    loadKey ({ commit }, key) {
      switch (key.type) {
        case 'string':
          return redis.async('get', key.name).then(() => commit('select', key))
        default:
          Vue.toasted.error(`${key.type} type is not supported`)
      }
    },
    deleteKey ({ state, commit }, name) {
      return redis.async('del', name).then(() => {
        if (state.selected === name) {
          commit('unloadKey')
        }

        commit('removeKey', { name })
      })
    },
    deleteListItem (store, { keyName, index }) {
      return redis.async('lset', keyName, index, 'REDIS-GUI--DELETED--')
        .then(() => redis.async('lrem', keyName, 0, 'REDIS-GUI--DELETED--').then(() => {
          Vue.toasted.info(`${keyName} list item at ${index} position deleted`)
        }))
    },
    deleteSetItem (store, { keyName, value }) {
      return redis.async('srem', keyName, value).then(() => Vue.toasted.info(`${keyName} set item deleted`))
    },
    deleteZsetItem (store, { keyName, value }) {
      return redis.async('zrem', keyName, value).then(() => Vue.toasted.info(`${keyName} sorted set item deleted`))
    },
    deleteHashItem (store, { keyName, key }) {
      return redis.async('hdel', keyName, key).then(() => Vue.toasted.info(`${keyName} hash ${key} key deleted`))
    },
  },
}
