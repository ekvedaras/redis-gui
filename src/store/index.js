import Vue from 'vue'
import Vuex from 'vuex'
import { redis } from '@/services/redis'
import _ from 'lodash'

Vue.use(Vuex)

let ttlTimer

export default new Vuex.Store({
  state: {
    databases: [],
    totalDatabases: 0,
    currentDatabase: 0,
    keys: [],
    nextKeysCursor: 0,
    currentKey: undefined,
  },
  getters: {
    keysWithTTL: state => _.filter(state.keys, key => key.ttl > -1),
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
      state.keys = keys
    },
    setNextKeysCursor (state, cursor) {
      state.nextKeysCursor = cursor
    },
    setCurrentKey (state, key) {
      state.currentKey = key
    },
    unloadKey (state) {
      state.currentKey = undefined
    },
    removeKey (state, key) {
      Vue.delete(state.keys, key.name)
    }
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
    loadKeys ({ commit, getters, state }) {
      return redis.keys().then(result => {
        commit('setNextKeysCursor', result.nextCursor)
        commit('setKeys', result.keys)

        if (!ttlTimer) {
          ttlTimer = setInterval(() =>
              Object
              .values(getters.keysWithTTL)
              .forEach(key => {
                state.keys[key.name].ttl--;
                if (state.keys[key.name].ttl <= 0) {
                  commit('removeKey', key)
                  if (state.currentKey.name === key.name) {
                    commit('unloadKey', key)
                  }

                  Vue.toasted.info(`Key ${key.name} has expired`)
                }
              }),
            1000,
          )
        }
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
          return redis.async('get', key.name).then(value => commit('setCurrentKey', { name: key, value }))
        default:
          Vue.toasted.error(`${key.type} type is not supported`)
      }
    },
  },
  modules: {},
})
