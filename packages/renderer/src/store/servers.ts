import type {Server} from '../../types/database'
import {defineStore} from 'pinia'
import {useDatabase} from '/@/use/database';

const database = useDatabase()

interface State {
  selected: string,
  connecting: boolean,
  connectingTo: string,
  connected: boolean,
  list: Record<string, Server>
}

export const useServersStore = defineStore('servers', {
  state: (): State => ({
    selected: Object.keys(database.data.servers)[0] ?? '',
    connecting: false,
    connectingTo: '',
    connected: false,
    list: {...database.data.servers},
  }),
  getters: {
    selectedHost: state => state.list[state.selected]?.host,
    hasServers: state => Object.keys(state.list).length > 0,
  },
})
