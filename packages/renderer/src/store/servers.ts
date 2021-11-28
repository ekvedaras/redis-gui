import type {ServerArray} from '../../types/database'
import {defineStore} from 'pinia'
import {useDatabase} from '/@/use/database';

const database = useDatabase()

interface State {
  selected: string,
  list: ServerArray
}

export const useServersStore = defineStore('servers', {
  state: (): State => ({
    selected: database.data.servers.default ? 'default' : Object.keys(database.data.servers)[0],
    list: database.data.servers,
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
