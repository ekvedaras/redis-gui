import {LocalStoragePreset} from 'lowdb/browser'
import type {DatabaseSettings} from '../../types/database'

const database = LocalStoragePreset<DatabaseSettings>('redis-gui', {
  servers: {},
  history: {},
  settings: {
    itemsPerPage: 100,
    namespaceSeparator: ':',
    leftPaneSize: '25%',
  },
})

export function useDatabase() {
  return database
}
