<template>
  <div class="bg-gray-200 p-4 flex flex-col space-y-4">
    <h2 class="text-lg">Servers</h2>
    <table>
      <tr v-for="(server, key) in servers" :key="key" @click="edit(key)" class="rounded cursor-pointer hover:bg-gray-400">
        <td class="p-2 font-semibold rounded-l">{{ server.name }}</td>
        <td class="w-full whitespace-no-wrap p-2 text-gray-600">{{ server.host }}: {{ server.port }}</td>
        <td class="p-2 rounded-r">
          <div class="flex space-x-1 justify-start">
            <button type="button" @click.stop="deleteServer(server, key)">
              <DeleteIcon class="w-6 text-gray-500 hover:text-redis"/>
            </button>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ServerModal from '@/components/Modals/ServerModal'
import { database } from '@/services/database'
import DeleteIcon from '@/components/Icons/DeleteIcon'

export default {
  name: 'ServerListModal',
  components: { DeleteIcon },
  computed: mapState(['servers']),
  methods: {
    ...mapMutations(['setServers']),
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
            }
          },
          {
            title: 'Confirm',
            handler: () => {
              database.get('servers').unset(key).write()
              this.setServers(database.read().get('servers').value())
              this.$modal.hide('dialog')
            },
          },
        ],
      }, {
        classes: 'z-50',
        class: 'z-10',
      })
    }
  },
}
</script>

<style scoped>

</style>
