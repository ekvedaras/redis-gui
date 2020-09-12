import Vue from 'vue'
import _ from 'lodash'

const { promisify } = require('util')

export const redis = {
  pageSize: 100,
  client: undefined,
  promises: {},
  connect () {
    if (this.client) {
      return
    }

    this.client = window.redis.createClient()
      .on('connect', () => Vue.toasted.info('Connected'))
      .on('error', error => Vue.toasted.error('REDIS ERROR: ' + error))
  },
  disconnect () {
    this.client && this.client.quit()
  },
  async (command, ...args) {
    this.connect()

    if (!Object.prototype.hasOwnProperty.call(this.promises, command)) {
      this.promises[command] = promisify(this.client[command]).bind(this.client)
    }

    // console.log(command, args);

    return this.promises[command](...args)
      .catch(error => {
        Vue.toasted.error(error)
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
