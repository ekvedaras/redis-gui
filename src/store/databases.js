import { redis } from '@/services/redis'

export default {
  namespaced: true,
  state: {
    list: [],
    total: 0,
    selected: 0,
  },
  mutations: {
    setDatabase (state, database) {
      state.list[database.index] = database
    },
    setTotal (state, total) {
      state.total = total
    },
    select (state, index) {
      state.selected = index
    },
  },
  actions: {
    load ({ commit }) {
      return Promise.all([
        redis.async('config', 'GET', 'databases').then(list => commit('setTotal', parseInt(list[1]))),
        redis.async('info', 'keyspace').then(databases => databases.split('\n').slice(1, -1).forEach(db => {
          let id, meta, key, value;

          [id, meta] = db.split(':')
          let database = { id, index: parseInt(id.replace('db', '')) }

          meta.split(',').forEach(param => {
            [key, value] = param.split('=')
            database[key] = value
          })

          commit('setDatabase', database)
        })),
      ])
    },
    select ({ commit, dispatch }, index) {
      index = parseInt(index)
      return redis.async('select', index).then(() => {
        commit('select', index)
        commit('unloadKey', undefined, { root: true })
        dispatch('loadKeys', undefined, { root: true })
      })
    },
  },
}
