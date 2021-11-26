import type {ServerArray} from '../../types/database'
import {defineStore} from 'pinia'

interface State {
  selected: string,
  list: ServerArray
}

export const useServersStore = defineStore('servers', {
  state: (): State => ({
    selected: '',
    list: {},
  }),
  getters: {
    selectedHost: state => state.list[state.selected].host,
  },
  actions: {
    select(server: string) {
      this.selected = server
    },
    setServers(servers: ServerArray) {
      this.list = servers
    },
  },
})
