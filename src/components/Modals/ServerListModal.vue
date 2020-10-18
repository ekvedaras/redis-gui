<template>
  <Modal title="Servers">
    <table>
      <tr v-for="(server, key) in list" :key="key" class="rounded hover:bg-gray-300">
        <td class="p-2 font-semibold rounded-l">{{ server.name }}</td>
        <td class="w-full whitespace-no-wrap p-2 text-gray-600">{{ server.host }}: {{ server.port }}</td>
        <td class="p-2 rounded-r">
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

export default {
  name: 'ServerListModal',
  components: { EditIcon, IconButton, Modal, DeleteIcon },
  computed: mapState('servers', ['list']),
  methods: {
    ...mapMutations('servers', ['setServers']),
    edit (key) {
      this.$modal.show(ServerModal, { serverKey: key })
    },
    deleteServer (server, key) {
      this.$modal.show('dialog', {
        title: 'Confirm',
        text: `Are you sure you want to delete <b>${server.name}</b>?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => {
              this.$modal.hide('dialog')
            },
          },
          {
            title: 'Confirm',
            handler: () => {
              database.get('servers').unset(key).write()
              database.get('history').unset(key).write()
              this.setServers(database.read().get('servers').value())
              this.$modal.hide('dialog')
            },
          },
        ],
      }, {
        classes: 'z-50',
        class: 'z-10',
      })
    },
  },
}
</script>

<style scoped>

</style>
