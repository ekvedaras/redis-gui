<script setup lang="ts">
import StateIndicator from './StateIndicator.vue'
import { useRedis } from '/@/use/redis'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useServersStore } from '/@/store/servers'
import { useDatabasesStore } from '/@/store/databases'
import { useKeysStore } from '/@/store/keys'

const redis = useRedis()
const serversStore = useServersStore()
const databasesStore = useDatabasesStore()
const keysStore = useKeysStore()

const connectingTo = ref<string>()

const connectionState = computed<'pending' | 'ok' | 'fail'>(() => {
  if (!connectingTo.value || !redis.client) {
    return 'pending'
  }
  if (redis.client.isConnectionOpen()) {
    return 'ok'
  }

  return 'fail'
})

const connectionMessage = computed<string>(() => {
  switch (connectionState.value) {
    case 'ok':
      return 'Connected'
    case 'pending':
      return 'Connecting...'
    default:
      return 'Connection failed'
  }
})

const connect = async ({ target }: Event) => {
  const select = target as HTMLSelectElement

  if (select.value === serversStore.selected) {
    return
  }

  try {
    connectingTo.value = select.value
    await redis.connect(select.value)
    await selectAndReload(select.value, false)
  } catch (error) {
    select.value = String(serversStore.selected)
    throw error
  }
}

const selectAndReload = async (server: string, disconnect = true) => {
  if (disconnect) {
    await redis.disconnect()
  }
  serversStore.selected = server
  await Promise.all([databasesStore.load, keysStore.loadKeys])
  await nextTick(() => connectingTo.value = String(Math.random()))
}

onMounted(() => setTimeout(async () => {
  await redis.connect('default')
  await databasesStore.load()
  await keysStore.loadKeys()
  connectingTo.value = String(Math.random())
}, 1000))
</script>

<template>
  <div class="flex items-center">
    <StateIndicator
      :key="connectingTo"
      v-tooltip="connectionMessage"
      :state="connectionState"
    />
    <select
      id="server"
      v-tooltip="'Choose redis server'"
      class="ml-2 bg-gray-300 dark:bg-gray-700 rounded p-1"
      :title="connectionMessage"
      @change="connect"
    >
      <option
        v-for="(storeServer, key) in serversStore.list"
        :key="key"
        :selected="storeServer.name === serversStore.selected"
        :value="key"
      >
        {{ storeServer.name }}
      </option>
    </select>
  </div>
</template>
