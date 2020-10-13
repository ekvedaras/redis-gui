<template>
  <select id="server" @change="connect">
    <option v-for="(storeServer, key) in list" :key="key" :value="storeServer.name" :selected="storeServer.name === selected">
      {{ storeServer.name }}
    </option>
  </select>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { redis } from '@/services/redis'

export default {
  name: 'ServerSelect',
  computed: mapState('servers', ['list', 'selected']),
  methods: {
    ...mapActions('databases', ['load']),
    ...mapMutations('servers', ['select']),
    connect ({ target }) {
      redis.connect(target.value)
      this.select(target.value)
      this.load()
    },
  },
}
</script>

<style scoped>

</style>
