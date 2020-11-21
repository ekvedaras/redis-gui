<template>
  <Modal title="Servers">
    <table class="rounded">
      <tr v-for="(server, key) in list" :key="key" class="rounded hover:bg-gray-300 dark:hover:bg-gray-700">
        <th class="p-2 font-semibold">{{ server.name }}</th>
        <td class="w-full whitespace-no-wrap p-2 text-gray-600">
          <span v-if="server.ssh.tunnel" class="rounded shadow bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100 px-1 mx-1">SSH</span>
          {{ server|serverDetails }}
        </td>
        <td class="p-2">
          <div class="flex space-x-1 justify-start">
            <IconButton @click="edit(key)">
              <EditIcon class="w-5 m-1"/>
            </IconButton>
            <IconButton @click="deleteServer(server, key)">
              <DeleteIcon class="w-5 m-1 "/>
            </IconButton>
          </div>
        </td>
      </tr>
    </table>
    <div class="flex justify-end">
      <PrimaryButton @click="openAddModal">Add</PrimaryButton>
    </div>
  </Modal>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ServerModal from '@/components/Modals/ServerModal'
import { database } from '@/services/database'
import DeleteIcon from '@/components/Icons/DeleteIcon'
import Modal from '@/components/Modals/Modal'
import IconButton from '@/components/Elements/IconButton'
import EditIcon from '@/components/Icons/EditIcon'
import Dialog from '@/components/Modals/Dialog'
import PrimaryButton from '@/components/Elements/PrimaryButton'

export default {
  name: 'ServerListModal',
  components: { PrimaryButton, EditIcon, IconButton, Modal, DeleteIcon },
  computed: mapState('servers', ['list']),
  filters: {
    serverDetails(server) {
      if (server.path) {
        return server.path
      }

      if (server.url) {
        return server.url
      }

      return `${server.host}:${server.port}`
    }
  },
  methods: {
    ...mapMutations('servers', ['setServers']),
    edit (key) {
      this.$modal.show(ServerModal, { serverKey: key })
    },
    deleteServer (server, key) {
      this.$modal.show(Dialog, {
        text: `Are you sure you want to delete <b>${server.name}</b>?`,
        handler: () => {
          database.get('servers').unset(key).write()
          database.get('history').unset(key).write()
          this.setServers(database.read().get('servers').value())
          this.$modal.hide('dialog')
        },
      }, { name: 'dialog' })
    },
    openAddModal() {
      this.$modal.show(ServerModal)
    }
  },
}
</script>

<style scoped>

</style>
