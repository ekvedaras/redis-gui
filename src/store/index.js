import Vue from 'vue'
import Vuex from 'vuex'
import { redis } from '@/services/redis'
import _ from 'lodash'
import { clearTtlTimer, registerTtlTimer } from '@/services/ttlTimer'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    databases: [],
    totalDatabases: 0,
    currentDatabase: 0,
    keys: {},
    nextKeysCursor: 0,
    selected: undefined,
  },
  getters: {
    keysWithTTL: state => _.filter(state.keys, key => key.ttl > -1),
    currentKey: state => _.find(state.keys, { name: state.selected }),
  },
  mutations: {
    setTotalDatabases (state, total) {
      state.totalDatabases = total
    },
    setDatabase (state, database) {
      state.databases[database.index] = database
    },
    setCurrentDatabase (state, index) {
      state.currentDatabase = index
    },
    setKeys (state, keys) {
      state.keys = _.sortKeysBy(keys)
    },
    addKey (state, key) {
      state.keys = _.sortKeysBy({ ...state.keys, [key.name]: key })
    },
    updateKey(state, key) {
      state.keys[key.name] = key
    },
    setNextKeysCursor (state, cursor) {
      state.nextKeysCursor = cursor
    },
    select (state, key) {
      state.selected = key
    },
    unloadKey (state) {
      state.selected = undefined
    },
    removeKey (state, key) {
      delete state.keys[key.name]
      clearTtlTimer()
      registerTtlTimer({ state, store: this })
    },
  },
  actions: {
    loadDatabases ({ commit }) {
      return Promise.all([
        redis.async('config', 'GET', 'databases').then(list => {
          commit('setTotalDatabases', parseInt(list[1]))
        }),
        redis.async('info', 'keyspace').then(databases => {
          databases.split("\n").slice(1, -1).forEach(db => {
            let id, meta, key, value;

            [id, meta] = db.split(':')
            let database = { id, index: parseInt(id.replace('db', '')) }

            meta.split(',').forEach(param => {
              [key, value] = param.split('=')
              database[key] = value
            })

            commit('setDatabase', database)
          })
        }),
      ])
    },
    loadKeys ({ commit, state, dispatch }, { pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0 } = {}) {
      registerTtlTimer({ state, store: this })

      return redis.keys(pattern, limit, cursor).then(result => {
        result.lastLoad = Object.keys(result.keys).length

        commit('setNextKeysCursor', result.nextCursor)
        commit('setKeys', result.keys = cursor ? { ...state.keys, ...result.keys } : result.keys)

        return result
      }).then(result => {
        if (result.nextCursor && lastLoad + result.lastLoad < limit) {
          return dispatch('loadKeys', { pattern, cursor: result.nextCursor, limit, lastLoad: lastLoad + Object.keys(result.keys).length })
        }

        return result
      })
    },
    selectDb ({ commit, dispatch }, index) {
      index = parseInt(index)
      return redis.async('select', index).then(() => {
        commit('setCurrentDatabase', index)
        commit('unloadKey', index)
        dispatch('loadKeys')
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
  },
  modules: {},
})
