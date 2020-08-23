import Vue from 'vue'

const { promisify } = require('util')

export const redis = {
  client: undefined,
  promises: {},
  connect () {
    this.client = window.redis.createClient()
      .on('connect', () => Vue.toasted.info('Connected'))
      .on('error', error => Vue.toasted.error('REDIS ERROR: ' + error))
  },
  disconnect () {
    this.client && this.client.quit()
  },
  async (command, ...args) {
    if (!Object.prototype.hasOwnProperty.call(this.promises, command)) {
      this.promises[command] = promisify(this.client[command]).bind(this.client)
    }

    return this.promises[command](...args)
      .catch(error => Vue.toasted.error(error))
  },
  keys (pattern = '*', limit = 100, cursor = 0) {
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
          keys.keys[name] = { name, type }
        })
      })

      return keys
    })
  },
}
