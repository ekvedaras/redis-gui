import {Module} from 'vuex'
import {useRedis} from '/@/use/redis'
import {State} from "/@/store/index";
import {parseInt} from "lodash";

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
        redis.client?.configGet('databases').then(res => {
          commit('setTotal', parseInt(res[1]))
        }),
        redis.client?.info('keyspace').then(res => {
          const databases = res.split('\n')
          const list = databases.map((database, index) => {
            const [db, keyspace] = database.split(':')
            return {
              index,
              db,
              keyspace,
            }
          })
          commit('resetList')
          commit('setDatabase', ...list)
        }),
        // redis.async('config', 'GET', 'databases').then(list => commit('setTotal', parseInt((list as string[])[1]))),
        // redis.async('info', 'keyspace').then(databases => {
        //   commit('resetList');
        //   (databases as string).split('\n').slice(1, -1).forEach((db: string) => {
        //     let key, value;
        //
        //     const [id, meta] = db.split(':')
        //     const database: Database = {id, index: parseInt(id.replace('db', ''))}
        //
        //     meta.split(',').forEach(param => {
        //       [key, value] = param.split('=')
        //       database[key] = value
        //     })
        //
        //     commit('setDatabase', database)
        //   })
        // }),
      ])
    },
    select({commit, dispatch}, index) {
      index = parseInt(index)
      return redis.client?.select(index).then(() => {
        commit('select', index)
        commit('keys/unloadKey', undefined, {root: true})
        dispatch('keys/loadKeys', undefined, {root: true})
      })
    },
  },
}
