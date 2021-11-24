import type {Module} from 'vuex'
import {useRedis} from '/@/use/redis'
import type {State} from '/@/store/index'
import {parseInt} from 'lodash'

const redis = useRedis()

export interface DatabasesState {
  list: Array<Database>,
  total: number,
  selected: string,
}

export const databasesStore: Module<DatabasesState, State> = {
  namespaced: true,
  state: {
    list: [],
    total: 0,
    selected: '',
  },
  mutations: {
    resetList(state) {
      state.list = []
    },
    setDatabase(state, database: Database) {
      state.list[database.index] = database
    },
    setTotal(state, total) {
      state.total = total
    },
    select(state, index) {
      state.selected = index
    },
  },
  actions: {
    load({commit}) {
      return Promise.all([
        redis.client.configGet('databases').then(({databases}) => {
          commit('setTotal', parseInt(databases))
        }),
        redis.client.info('keyspace').then(result => {
          result.split('\n').slice(1, -1).forEach((db: string) => {
            let key, value;

            const [id, meta] = db.split(':')
            const database: Database = {id, index: parseInt(id.replace('db', ''))}

            meta.split(',').forEach(param => {
              [key, value] = param.split('=')
              database[key] = value
            })

            commit('resetList')
            commit('setDatabase', database)
          })
        }),
      ])
    },
    select({commit, dispatch}, index) {
      index = parseInt(index)
      return redis.client.select(index).then(() => {
        commit('select', index)
        commit('keys/unloadKey', undefined, {root: true})
        dispatch('keys/loadKeys', undefined, {root: true})
      })
    },
  },
}
