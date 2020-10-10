import { database } from '@/services/database'

export default {
  namespaced: true,
  state: {
    selected: 'default',
    list: database.get('servers').value(),
  },
  getters: {
    selectedHost: state => state.list[state.selected].host,
  },
  mutations: {
    select (state, server) {
      state.selected = server
    },
    setServers (state, servers) {
      state.list = servers
    },
  },
}
