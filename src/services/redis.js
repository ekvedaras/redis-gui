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
  keys (pattern = '*', limit = 1000, cursor = 0) {
    return this.async('scan', cursor, 'match', pattern, 'count', limit).then(result => {
      return {
        nextCursor: parseInt(result[0]),
        keys: result.length > 1 ? result[1] : [],
      }
    })
  },
}
