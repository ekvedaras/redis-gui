import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const defaultDatabase = {
  servers: {
    default: {
      name: 'default',
      host: '127.0.0.1',
      port: 6379,
      password: null,
    },
  },
}

export const database = low(new LocalStorage('redis-gui'));

database.defaults(defaultDatabase).write()