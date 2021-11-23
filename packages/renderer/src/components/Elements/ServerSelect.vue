<template>
  <div class="flex items-center">
    <StateIndicator :key="connectingTo" :state="connectionState" />
    <select id="server" @change="connect" class="ml-2 bg-gray-300 dark:bg-gray-700 rounded p-1">
      <option v-for="(storeServer, key) in store.state.databases.list" :key="key" :value="key" :selected="storeServer.name === store.state.databases.selected">
        {{ storeServer.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import StateIndicator from './StateIndicator.vue'
import { useRedis } from '/@/use/redis'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useStore } from '/@/store'

const redis = useRedis()
const store = useStore()

const connectingTo = ref<string>()

const connectionState = computed(() => {
  if (!connectingTo.value || !redis.client) {
    return 'pending'
  }

  if (redis.client.isOpen) {
    return 'ok'
  }

  return 'fail'
})

const connectionMessage = computed(() => {
  switch (connectionState.value) {
    case 'ok':
      return 'Connected'
    case 'pending':
      return 'Connecting...'
    default:
      return 'Connection failed'
  }
})

const connect = ({target}: Event) => {
  const select = target as HTMLSelectElement

  if (select.value === store.state.databases.selected) {
    return
  }

  connectingTo.value = select.value
  redis.connect(select.value, {
    onReady: () => {
      selectAndReload(select.value)
    },
  }).catch((e) => {
    select.value = store.state.databases.selected
    throw e
  })
}

const selectAndReload = (server: string) => {
  redis.disconnect()
  store.dispatch('databases/select', server)
  store.dispatch('databases/load').then(() => nextTick(() => connectingTo.value = String(Math.random())))
}

onMounted(() => setTimeout(() => {
  redis.connect('default')
  store.dispatch('databases/load').then(() => connectingTo.value = String(Math.random()))
}, 1000))
</script>

<style scoped>

</style>
