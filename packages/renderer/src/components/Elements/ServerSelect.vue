<script setup lang="ts">
import StateIndicator from './StateIndicator.vue'
import { useRedis } from '/@/use/redis'
import { computed, onMounted, watch } from 'vue'
import { useServersStore } from '/@/store/servers'
import { useDatabasesStore } from '/@/store/databases'
import { useKeysStore } from '/@/store/keys'
import { useToaster } from '/@/use/toaster'

const redis = useRedis()
const serversStore = useServersStore()
const databasesStore = useDatabasesStore()
const keysStore = useKeysStore()

const connectionState = computed<'pending' | 'ok' | 'fail'>(() => {
  if (serversStore.connecting) {
    return 'pending'
  }
  if (redis.client.isConnectionOpen() && serversStore.connected) {
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

const toaster = useToaster()
const connect = async ({ target }: Event) => {
  const select = target as HTMLSelectElement

  try {
    await redis.connect(select.value)
    await reload(select.value)
  } catch (error) {
    toaster.error(String(error))
  }
}

const reload = async (server: string) => {
  serversStore.selected = server
  await Promise.all([databasesStore.load(), keysStore.loadKeys()])
}

const connectToFirst = async () => {
  if (serversStore.hasServers) {
    const server = Object.keys(serversStore.list)[0]
    await redis.connect(server)
    await reload(server)
  }
}
onMounted(connectToFirst)
watch(() => serversStore.hasServers, connectToFirst)
</script>

<template>
  <div class="flex items-center">
    <StateIndicator
      v-tooltip.left="connectionMessage"
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
