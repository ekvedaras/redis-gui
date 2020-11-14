<template>
  <div class="flex items-center">
    <StateIndicator :state="connectionState" v-tooltip="connectionMessage"/>
    <select id="server" @change="connect" class="ml-2 bg-gray-300 dark:bg-gray-700 rounded p-1" v-tooltip="'Choose redis server'">
      <option v-for="(storeServer, key) in list" :key="key" :value="storeServer.name" :selected="storeServer.name === selected">
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
      this.connectingTo = this.selected
    }, 500)
  },
  computed: {
    ...mapState('servers', ['list', 'selected']),
    connectionState() {
      let connection = this.connectingTo || this.selected

      if (!redis.client[connection]) {
        return 'pending';
      }

      if (redis.client[connection].ready) {
        return 'ok'
      }

      if (redis.client[connection].connected) {
        return 'pending';
      }

      return 'fail';
    },
    connectionMessage() {
      switch (this.connectionState) {
        case 'ok':
          return 'Connected';
        case 'pending':
          return 'Connecting...';
        default:
          return 'Connection failed';
      }
    }
  },
  methods: {
    ...mapActions('databases', ['load']),
    ...mapMutations('servers', ['select']),
    connect ({ target }) {
      this.connectingTo = target.value
      redis.connect(target.value, {
        onReady: () => {
          this.select(target.value)
          this.load()
          this.connectingTo = this.selected
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
