<script setup lang="ts">
import StateIndicator from './StateIndicator.vue'
import { useRedis } from '/@/use/redis'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useServersStore } from '/@/store/servers'
import { useDatabasesStore } from '/@/store/databases'
import { useKeysStore } from '/@/store/keys'
import { useToaster } from '/@/use/toaster'

const redis = useRedis()
const serversStore = useServersStore()
const databasesStore = useDatabasesStore()
const keysStore = useKeysStore()

const connectingTo = ref<string>()

const connectionState = computed<'pending' | 'ok' | 'fail'>(() => {
  if (!connectingTo.value || !redis.client.isConnectionOpen()) {
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

const toaster = useToaster()
const connect = async ({target}: Event) => {
  const select = target as HTMLSelectElement

  try {
    connectingTo.value = select.value
    await redis.connect(select.value)
    await reload(select.value)
  } catch (error) {
    toaster.error(String(error))
  }
}

const reload = async (server: string) => {
  serversStore.selected = server
  await Promise.all([databasesStore.load(), keysStore.loadKeys()])
  await nextTick(() => connectingTo.value = String(Math.random()))
}

onMounted(() => setTimeout(async () => {
  connectingTo.value = 'default'
  await redis.connect('default')
  await reload('default')
}, 10))
</script>

<template>
  <div class="flex items-center">
    <StateIndicator
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
