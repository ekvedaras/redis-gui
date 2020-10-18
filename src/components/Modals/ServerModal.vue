<template>
  <Modal :title="title">
    <input type="text" placeholder="Name" v-model="name" class="p-2 rounded shadow"/>
    <div class="flex space-x-4">
      <input type="text" placeholder="Host / IP" v-model="host" class="p-2 rounded shadow flex-1"/>
      <input type="number" placeholder="Port" v-model="port" class="p-2 rounded shadow"/>
    </div>
    <input type="password" placeholder="Password (optional)" v-model="password" class="p-2 rounded shadow"/>
    <div class="flex justify-end space-x-4">
      <Button @click="test">Test</Button>
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

export default {
  name: 'ServerModal',
  components: { PrimaryButton, Button, Modal },
  props: ['serverKey'],
  data: () => ({
    name: '',
    host: '',
    port: 6379,
    password: undefined,
  }),
  created () {
    if (this.serverKey) {
      let server = database.get(`servers.${this.serverKey}`).value()
      this.name = server.name
      this.host = server.host
      this.port = server.port
      this.password = server.password
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
    test () {
      let connection = window.redis.createClient({
        ...this.$data,
        retry_strategy: () => {
          return undefined
        },
      }).on('connect', () => {
        this.$toasted.success('Connection successful')
        connection.quit(() => {
          connection.end(true)
        })
      }).on('error', error => this.$toasted.error('REDIS ERROR: ' + error))
    },
  },
  computed: {
    title () {
      return this.serverKey ? 'Edit server' : 'Add new server'
    },
  },
}
</script>

<style scoped>

</style>
