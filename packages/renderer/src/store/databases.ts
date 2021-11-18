import {createStore} from 'vuex'
import {useRedis} from '/@/use/redis'

const redis = useRedis()

export interface DatabasesState {
  list: Array<Database>,
  total: number,
  selected: number,
}

export const databasesStore = createStore<DatabasesState>({
  state: {
    list: [],
    total: 0,
    selected: 0,
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
        redis.async('config', 'GET', 'databases').then(list => commit('setTotal', parseInt((list as string[])[1]))),
        redis.async('info', 'keyspace').then(databases => {
          commit('resetList');
          (databases as string).split('\n').slice(1, -1).forEach((db: string) => {
            let key, value;

            const [id, meta] = db.split(':')
            const database: Database = {id, index: parseInt(id.replace('db', ''))}

            meta.split(',').forEach(param => {
              [key, value] = param.split('=')
              database[key] = value
            })

            commit('setDatabase', database)
          })
        }),
      ])
    },
    select({commit, dispatch}, index) {
      index = parseInt(index)
      return redis.async('select', index).then(() => {
        commit('select', index)
        commit('keys/unloadKey', undefined, {root: true})
        dispatch('keys/loadKeys', undefined, {root: true})
      })
    },
  },
})
