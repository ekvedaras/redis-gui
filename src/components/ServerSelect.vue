<template>
  <select id="server" @change="connect">
    <option v-for="(storeServer, key) in list" :key="key" :value="storeServer.name" :selected="storeServer.name === selected">
      {{ storeServer.name }}
    </option>
  </select>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { redis } from '@/services/redis'

export default {
  name: 'ServerSelect',
  computed: mapState('servers', ['list', 'selected']),
  methods: {
    ...mapActions(['loadDatabases']),
    connect ({ target }) {
      redis.connect(target.value)
      this.$store.commit('servers/select', target.value)
      this.loadDatabases()
    },
  },
}
</script>

<style scoped>

</style>
