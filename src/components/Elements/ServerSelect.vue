<template>
  <div class="flex items-center">
    <StateIndicator :key="connectingTo" :state="connectionState" v-tooltip="connectionMessage"/>
    <select id="server" @change="connect" class="ml-2 bg-gray-300 dark:bg-gray-700 rounded p-1" v-tooltip="'Choose redis server'">
      <option v-for="(storeServer, key) in list" :key="key" :value="key" :selected="storeServer.name === selected">
        {{ storeServer.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { redis } from '@/services/redis'
import StateIndicator from '@/components/Elements/StateIndicator'

export default {
  name: 'ServerSelect',
  components: { StateIndicator },
  data: () => ({
    connectingTo: '',
  }),
  mounted () {
    setTimeout(() => {
      this.load().then(() => this.connectingTo = Math.random())
    }, 1000)
  },
  computed: {
    ...mapState('servers', ['list', 'selected']),
    connectionState () {
      if (!this.connectingTo || !redis.client[this.selected]) {
        return 'pending'
      }

      if (redis.client[this.selected].ready) {
        return 'ok'
      }

      if (redis.client[this.selected].connected) {
        return 'pending'
      }

      return 'fail'
    },
    connectionMessage () {
      switch (this.connectionState) {
        case 'ok':
          return 'Connected'
        case 'pending':
          return 'Connecting...'
        default:
          return 'Connection failed'
      }
    },
  },
  methods: {
    ...mapActions('databases', ['load']),
    ...mapActions('keys', ['loadKeys']),
    ...mapMutations('servers', ['select']),
    connect ({ target }) {
      if (target.value === this.selected) {
        return
      }

      this.connectingTo = target.value
      redis.connect(target.value, {
        onReady: () => {
          this.selectAndReload(target.value)
        },
      }).catch((e) => {
        target.value = this.selected
        throw e
      })
    },
    selectAndReload (server) {
      redis.disconnect(this.selected)
      this.select(server)
      this.load().then(() => this.$nextTick(() => this.connectingTo = Math.random()))
    },
  },
}
</script>

<style scoped>

</style>
