import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const defaultDatabase = {
  servers: {
    default: {
      name: 'default',
      host: 'localhost',
      port: 6379,
      ssh: {
        tunnel: false,
        host: '',
        port: 22,
      },
    },
  },
  history: {
    default: [],
  },
  settings: {
    itemsPerPage: 100,
    namespaceSeparator: ':',
  },
}

export const database = low(new LocalStorage('redis-gui'))

database.defaults(defaultDatabase).write()
