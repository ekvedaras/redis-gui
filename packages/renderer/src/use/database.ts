import {LocalStorage, LowSync} from 'lowdb'
import type {DatabaseSettings} from '../../types/database'

const defaultDatabase: DatabaseSettings = {
  servers: {},
  history: {},
  settings: {
    itemsPerPage: 100,
    namespaceSeparator: ':',
    leftPaneSize: '25%',
  },
}

const database = new LowSync<DatabaseSettings>(
  new LocalStorage<DatabaseSettings>('redis-gui'),
)

await database.read()

database.data ||= defaultDatabase

await database.write()

type DB = Omit<LowSync, 'data'> & {
  data: DatabaseSettings,
}

export function useDatabase(): DB {
  return database as DB
}
