<template>
  <div class="bg-gray-200 p-4 flex flex-col space-y-4">
    <h2 class="text-lg">Servers</h2>
    <table>
      <tr v-for="(server, key) in servers" :key="key">
        <td>{{ server.name }}</td>
        <td class="w-full">{{ server.host }}: {{ server.port }}</td>
        <td class="flex space-x-1">
          <button type="button" @click="edit(key)" class="text-xs transition transition-colors duration-100 ease-in-out px-1 bg-red-700 text-white rounded shadow hover:shadow-md hover:bg-redis">Edit</button>
          <button type="button" @click="deleteServer(server, key)" class="text-xs transition transition-colors duration-100 ease-in-out px-1 bg-red-700 text-white rounded shadow hover:shadow-md hover:bg-redis">Delete</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ServerModal from '@/components/Modals/ServerModal'
import { database } from '@/services/database'

export default {
  name: 'ServerListModal',
  computed: mapState(['servers']),
  methods: {
    ...mapMutations(['setServers']),
    edit (key) {
      this.$modal.show(ServerModal, { serverKey: key })
    },
    deleteServer (server, key) {
      this.$modal.hideAll()
      this.$modal.show('dialog', {
        title: 'Confirm',
        text: `Are you sure you want to delete <b>${server.name}</b>?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => {
              this.$modal.hide('dialog')
              this.$modal.show(this)
            }
          },
          {
            title: 'Confirm',
            handler: () => {
              database.get('servers').unset(key).write()
              this.setServers(database.read().get('servers').value())
              this.$modal.hide('dialog')
              this.$modal.show(this)
            },
          },
        ],
      }, {
        classes: 'z-50',
      })
    }
  },
}
</script>

<style scoped>

</style>
