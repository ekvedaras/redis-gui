import Vue from 'vue'
import Vuex from 'vuex'
import { redis } from '@/services/redis'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    databases: [],
    totalDatabases: 0,
    currentDatabase: 0,
    keys: [],
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
    loadKeys ({ commit }) {
      return redis.async('keys', '*').then(keys => commit('setKeys', keys))
    },
    selectDb ({ commit, dispatch }, index) {
      index = parseInt(index)
      return redis.async('select', index).then(() => {
        commit('setCurrentDatabase', index)
        dispatch('loadKeys')
      })
    },
  },
  modules: {},
})
