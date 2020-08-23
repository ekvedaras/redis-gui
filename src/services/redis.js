import Vue from 'vue'

const { promisify } = require('util')

export const redis = {
  client: undefined,
  connect () {
    this.client = window.redis.createClient()
  },
  disconnect () {
    this.client && this.client.quit()
  },
  async (command, ...args) {
    return (promisify(this.client[command]).bind(this.client))(...args)
      .catch(error => Vue.toasted.error(error))
  },
}
