<template>
  <select id="server" @change="connect">
    <option v-for="(storeServer, key) in servers" :key="key" :value="storeServer.name" :selected="storeServer.name === server">
      {{ storeServer.name }}
    </option>
  </select>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { redis } from '@/services/redis'

export default {
  name: 'ServerSelect',
  computed: {
    ...mapState(['servers', 'server']),
  },
  methods: {
    ...mapActions(['loadDatabases']),
    connect ({ target }) {
      redis.connect(target.value)
      this.$store.commit('setServer', target.value)
      this.loadDatabases()
    },
  },
}
</script>

<style scoped>

</style>
