<template>
  <div v-if="!hasServers">
    <h1 class="text-2xl font-light">No servers added.</h1>
    <button @click="addServer" class="mt-4 bg-red-500 py-2 px-4 rounded shadow text-white">Add one</button>
  </div>
  <div v-else>
    Connect:
  </div>
</template>

<script>

import { database } from '@/database'

export default {
  name: 'Home',
  methods: {
    addServer () {
      const server = {
        name: 'Test server',
        host: '127.0.0.1',
        port: 6379,
        password: null,
      }

      database.get('servers').set(server.name, server).write()
    },
  },
  computed: {
    hasServers: () => !database.get('servers').isEmpty(),
  },
}
</script>
