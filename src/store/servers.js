import { database } from '@/services/database'

export default {
  namespaced: true,
  state: {
    selected: 'default',
    list: database.get('servers').value(),
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
