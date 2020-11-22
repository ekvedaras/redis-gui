<template>
  <Modal :title="title">
    <input type="text" placeholder="Name" v-model="name"/>
    <div class="flex space-x-4">
      <input type="text" placeholder="Host / IP" v-model="host" class="flex-1"/>
      <input type="number" placeholder="Port" v-model="port"/>
    </div>
    <input v-if="!ssh.tunnel" type="text" placeholder="or UNIX socket path" v-model="path" class="flex-1"/>
    <input v-if="!ssh.tunnel" type="text" placeholder="or URL (redis://, rediss://)" v-model="url" class="flex-1"/>
    <input type="password" placeholder="Password (optional)" v-model="password"/>
    <div class="flex space-x-4 items-baseline">
      <input type="checkbox" v-model="ssh.tunnel" id="ssh"/>
      <label for="ssh">SSH tunnel</label>
    </div>
    <div v-if="ssh.tunnel" class="flex flex-col space-y-4">
      <div class="flex space-x-4">
        <input type="text" placeholder="SSH host / IP" v-model="ssh.host" class="flex-1"/>
        <input type="number" placeholder="SSH port" v-model="ssh.port"/>
      </div>
      <div class="flex space-x-4">
        <input type="text" placeholder="SSH user (optional)" v-model="ssh.user" class="flex-1"/>
        <input type="password" placeholder="SSH password (optional)" v-model="ssh.password" class="flex-1"/>
      </div>
      <div class="flex space-x-4">
        <input type="text" :placeholder="privateKeyPlaceholder" v-model="ssh.privateKey" class="flex-1"/>
      </div>
    </div>
    <div class="flex justify-end space-x-4">
      <div v-if="isTesting" class="relative w-10 h-10 flex items-center justify-end">
        <Spinner/>
      </div>
      <Button @click="test" class="relative">
        Test
      </Button>
      <PrimaryButton @click="save">Save</PrimaryButton>
    </div>
  </Modal>
</template>

<script>
import { database } from '@/services/database'
import { mapMutations } from 'vuex'
import Modal from '@/components/Modals/Modal'
import Button from '@/components/Elements/Button'
import PrimaryButton from '@/components/Elements/PrimaryButton'
import { redis } from '@/services/redis'
import Spinner from '@/components/Elements/Spinner'

export default {
  name: 'ServerModal',
  components: { Spinner, PrimaryButton, Button, Modal },
  props: ['serverKey'],
  data: () => ({
    isTesting: false,
    name: '',
    host: '',
    port: 6379,
    path: undefined,
    url: undefined,
    password: undefined,
    ssh: {
      tunnel: false,
      host: '',
      port: 22,
      user: undefined,
      password: undefined,
      privateKey: undefined,
    },
  }),
  created () {
    if (this.serverKey) {
      let server = database.get(`servers.${this.serverKey}`).value()
      this.name = server.name
      this.host = server.host
      this.port = server.port
      this.path = server.path
      this.url = server.url
      this.password = server.password
      this.ssh = server.ssh
    }
  },
  methods: {
    ...mapMutations('servers', ['setServers']),
    save () {
      database.get('servers').set(this.serverKey || this.name, { ...this.$data }).write()
      database.get('history').set(this.serverKey || this.name, []).write()
      this.setServers(database.read().get('servers').value())
      this.$emit('close')
    },
    async test () {
      this.isTesting = true
      let connection = (await redis.createClient({
        ...this.$data,
        retry_strategy: () => {
          return undefined
        },
      }).catch(error => {
        this.isTesting = false
        throw error
      })).on('ready', () => {
        this.$toasted.success('Connection successful')
        this.isTesting = false
        connection.quit(() => {
          connection.end(true)
        })
      }).on('error', error => {
        this.$toasted.error('REDIS ERROR: ' + error)
        this.isTesting = false
      })
    },
  },
  computed: {
    title () {
      return this.serverKey ? 'Edit server' : 'Add new server'
    },
    privateKeyPlaceholder () {
      return `Private key. Default: ${window.homedir}/.ssh/id_rsa`
    },
  },
}
</script>

<style scoped>

</style>
