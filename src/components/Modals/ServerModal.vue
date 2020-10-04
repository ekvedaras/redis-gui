<template>
  <div class="bg-gray-200 p-4 flex flex-col space-y-4">
    <h2 class="text-lg">{{ title }}</h2>
    <input type="text" placeholder="Name" v-model="name" class="p-2 rounded shadow"/>
    <div class="flex space-x-4">
      <input type="text" placeholder="Host / IP" v-model="host" class="p-2 rounded shadow flex-1"/>
      <input type="number" placeholder="Port" v-model="port" class="p-2 rounded shadow"/>
    </div>
    <input type="password" placeholder="Password" v-model="password" class="p-2 rounded shadow"/>
    <div class="flex justify-end space-x-4">
      <button @click="test" class="flex relative transition transition-colors duration-100 ease-in-out p-2 bg-red-700 text-white rounded shadow hover:shadow-md hover:bg-redis">Test</button>
      <button @click="save" class="transition transition-colors duration-100 ease-in-out p-2 bg-red-700 text-white rounded shadow hover:shadow-md hover:bg-redis">Save</button>
    </div>
  </div>
</template>

<script>
import { database } from '@/services/database'
import { mapMutations } from 'vuex'

export default {
  name: 'ServerModal',
  props: ['server-key'],
  data: () => ({
    name: '',
    host: '',
    port: 6379,
    password: undefined,
  }),
  created () {
    if (this.serverKey) {
      let server = database.get(`servers.${this.serverKey}`).value()
      this.name = server.name
      this.host = server.host
      this.port = server.port
      this.password = server.password
    }
  },
  methods: {
    ...mapMutations('servers', ['setServers']),
    save () {
      database.get('servers').set(this.serverKey || this.name, { ...this.$data }).write()
      database.get('history').set(this.serverKey || this.name, []).write()
      this.setServers(database.read().get('servers').value())
      this.$emit('close')
    },
    test () {
      let connection = window.redis.createClient({
        ...this.$data,
        retry_strategy: () => {
          return undefined
        },
      }).on('connect', () => {
        this.$toasted.success('Connection successful')
        connection.quit(() => {
          connection.end(true)
        })
      }).on('error', error => this.$toasted.error('REDIS ERROR: ' + error))
    },
  },
  computed: {
    title () {
      return this.serverKey ? 'Edit server' : 'Add new server'
    },
  },
}
</script>

<style scoped>

</style>
