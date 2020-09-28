import Vue from 'vue'
import _ from 'lodash'
import { database } from '@/services/database'

const { promisify } = require('util')

export const redis = {
  pageSize: 100,
  current: 'default',
  client: {},
  promises: {},
  beSilent: false,
  connect (server = 'default') {
    if (server !== this.current) {
      Object.entries(this.client).forEach(([key, client]) => {
        if (!client.connected) {
          this.client[key].quit(() => {
            this.client[key].end(true)
            delete this.client[key]
          })
        }
      })
    }

    if (this.client[server]) {
      return
    }

    this.current = server

    this.client[server] = window.redis.createClient(database.get(`servers.${server}`).value())
      .on('connect', () => Vue.toasted.info('Connected'))
      .on('error', error => {
        Vue.toasted.error('REDIS ERROR: ' + error)
      })
  },
  disconnect (server = 'default') {
    this.client[server] && this.client[server].quit()
  },
  silently () {
    this.beSilent = true
    return this
  },
  async (command, ...args) {
    let beSilent = this.beSilent
    this.beSilent = false

    this.connect(this.current)

    if (!Object.prototype.hasOwnProperty.call(this.promises, command)) {
      try {
        this.promises[command] = promisify(this.client[this.current][command]).bind(this.client[this.current])
      } catch (e) {
        return Promise.reject('Invalid redis command')
      }
    }
    
    return this.promises[command](...args).catch(error => {
      if (!beSilent) Vue.toasted.error(error)
      throw error
    })
  },
  keys (pattern = '*', limit = this.pageSize, cursor = 0) {
    return this.async('scan', cursor, 'match', pattern, 'count', limit).then(async result => {
      let keys = {
        nextCursor: parseInt(result[0]),
        keys: {},
      }

      if (result.length === 1) {
        return keys
      }

      await Promise.all(result[1].map(key => this.async('type', key))).then(types => {
        types.forEach((type, index) => {
          let name = result[1][index]
          _.set(keys.keys, `${name}.name`, name)
          _.set(keys.keys, `${name}.type`, type)
        })
      })

      await Promise.all(result[1].map(key => this.async('ttl', key))).then(ttls => {
        ttls.forEach((ttl, index) => {
          let name = result[1][index]
          _.set(keys.keys, `${name}.name`, name)
          _.set(keys.keys, `${name}.ttl`, ttl)
        })
      })

      await Promise.all(result[1].map(key => this.async('object', 'encoding', key))).then(encodings => {
        encodings.forEach((encoding, index) => {
          let name = result[1][index]
          _.set(keys.keys, `${name}.name`, name)
          _.set(keys.keys, `${name}.encoding`, encoding)
        })
      })

      return keys
    })
  },
}
