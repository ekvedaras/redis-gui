<template>
  <AppModal :title="title" @close="emit('close')">
    <input v-model="name" type="text" placeholder="Name" />
    <div class="flex space-x-4">
      <input v-model="host" type="text" placeholder="Host / IP" class="flex-1" />
      <input v-model="port" type="number" placeholder="Port" />
    </div>
    <input v-if="!ssh.tunnel" v-model="path" type="text" placeholder="or UNIX socket path" class="flex-1" />
    <input v-if="!ssh.tunnel" v-model="url" type="text" placeholder="or URL (redis://, rediss://)" class="flex-1" />
    <input v-model="password" type="password" placeholder="Password (optional)" />
    <div class="flex space-x-4 items-baseline">
      <input id="ssh" v-model="ssh.tunnel" type="checkbox" />
      <label for="ssh">SSH tunnel</label>
    </div>
    <div v-if="ssh.tunnel" class="flex flex-col space-y-4">
      <div class="flex space-x-4">
        <input v-model="ssh.host" type="text" placeholder="SSH host / IP" class="flex-1" />
        <input v-model="ssh.port" type="number" placeholder="SSH port" />
      </div>
      <div class="flex space-x-4">
        <input v-model="ssh.user" type="text" placeholder="SSH user (optional)" class="flex-1" />
        <input v-model="ssh.password" type="password" placeholder="SSH password (optional)" class="flex-1" />
      </div>
      <div class="flex space-x-4">
        <input v-model="ssh.privateKey" type="text" :placeholder="privateKeyPlaceholder" class="flex-1" />
      </div>
    </div>
    <div class="flex justify-end space-x-4">
      <div v-if="isTesting" class="relative w-10 h-10 flex items-center justify-end">
        <Spinner />
      </div>
      <Button class="relative" @click="test">
        Test
      </Button>
      <Button @click="emit('close')">
        Cancel
      </Button>
      <PrimaryButton @click="save">
        Save
      </PrimaryButton>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from '/@/components/Elements/AppModal.vue'
import { computed, onBeforeMount, ref } from 'vue'
import Button from '/@/components/Elements/Button.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'
import type { SshConfig } from '../../../types/database'
import { useDatabase } from '/@/use/database'
import { useServersStore } from '/@/store/servers'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import Spinner from '/@/components/Elements/Spinner.vue'

const props = defineProps<{
  serverKey?: string | undefined;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const isTesting = ref(false)
const name = ref('')
const host = ref('')
const port = ref(6379)
const path = ref<string | undefined>(undefined)
const url = ref<string | undefined>(undefined)
const password = ref<string | undefined>(undefined)
const ssh = ref<SshConfig>({
  tunnel: false,
  host: '',
  port: 22,
  user: undefined,
  password: undefined,
  privateKey: undefined,
})

const title = computed(() => props.serverKey ? 'Edit server' : 'Add new server')
const privateKeyPlaceholder = computed(() => `Private key. Default: ${ window.fsApi.homedir }/.ssh/id_rsa`)

const database = useDatabase()
onBeforeMount(() => {
  if (props.serverKey) {
    let server = database.data.servers[props.serverKey]
    name.value = server.name
    host.value = server.host
    port.value = server.port
    path.value = server.path
    url.value = server.url
    password.value = server.password
    ssh.value = server.ssh
  }
})

const serversStore = useServersStore()
const save = async () => {
  database.data.servers[props.serverKey || name.value] = {
    name: name.value,
    host: host.value,
    port: port.value,
    path: path.value,
    url: url.value,
    password: password.value,
    ssh: ssh.value,
  }
  database.data.history[props.serverKey || name.value] = []
  await database.write()
  serversStore.list = database.data.servers
  emit('close')
}

const redis = useRedis()
const toaster = useToaster()
const test = async () => {
  isTesting.value = true

  try {
    window.testRedisApi.createClient({
      ...redis.buildConnectionConfig({
        host: host.value,
        port: port.value,
        path: path.value,
        url: url.value,
        password: password.value,
        ssh: ssh.value,
      }),
      retry_strategy: () => {
        return undefined // TODO
      },
    })

    window.testRedisApi.client.on('ready', () => {
      toaster.success('Connection successful')
      isTesting.value = false
      window.testRedisApi.client.quit()
    })

    window.testRedisApi.client.on('error', (error: unknown) => {
      toaster.error(`REDIS ERROR: ${ error }`)
      isTesting.value = false
    })

    await window.testRedisApi.client.connect()
  } finally {
    isTesting.value = false
  }
}
</script>

<style scoped></style>
