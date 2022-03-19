<script setup lang="ts">
import AppModal from '/@/components/Elements/AppModal.vue'
import { useServersStore } from '/@/store/servers'
import type { Server } from 'types/database'
import { ref, watch } from 'vue'
import ConfirmDialog from '/@/components/Elements/ConfirmDialog.vue'
import { useDatabase } from '/@/use/database'
import Button from '/@/components/Elements/Button.vue'
import IconButton from '/@/components/Elements/IconButton.vue'
import EditIcon from '/@/components/Icons/EditIcon.vue'
import DeleteIcon from '/@/components/Icons/DeleteIcon.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'
import ServerModal from '/@/components/Elements/ServerModal.vue'
import { useServerRepresenter } from '/@/use/serverRepresenter'

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const serversStore = useServersStore()
const {representServer} = useServerRepresenter()

const shouldShowServerModal = ref(!serversStore.hasServers)
watch(() => serversStore.hasServers, () => shouldShowServerModal.value = !serversStore.hasServers)
const serverToEdit = ref<string | undefined>(undefined)
const edit = (key?: string) => {
  serverToEdit.value = key
  shouldShowServerModal.value = true
}

const shouldShowDeleteDialog = ref(false)
const serverToDelete = ref<Server | null>(null)
const database = useDatabase()
const confirmDelete = (server: Server) => {
  serverToDelete.value = server
  shouldShowDeleteDialog.value = true
}
const deleteServer = (server: Server) => {
  delete database.data.servers[server.name]
  delete database.data.history[server.name]
  database.write()
  if (serversStore.selected == server.name) {
    serversStore.selected = ''
    serversStore.connectingTo = ''
    serversStore.connected = false
  }
  delete serversStore.list[server.name]
  shouldShowDeleteDialog.value = false
}
</script>

<template>
  <AppModal title="Servers" @close="emit('close')">
    <table class="rounded">
      <tr
        v-for="(server, key) in serversStore.list"
        :key="key"
        class="rounded hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <th class="p-2 font-semibold">
          {{ server.name }}
        </th>
        <td class="w-full whitespace-no-wrap p-2 text-gray-600">
          <span
            v-if="server.ssh.tunnel"
            class="rounded shadow bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100 px-1 mx-1"
          >SSH</span>
          {{ representServer(server) }}
        </td>
        <td class="p-2">
          <div class="flex space-x-1 justify-start">
            <IconButton @click="edit(key)">
              <EditIcon class="w-5 m-1" />
            </IconButton>
            <IconButton @click="confirmDelete(server)">
              <DeleteIcon class="w-5 m-1 " />
            </IconButton>
          </div>
        </td>
      </tr>
    </table>
    <div class="flex justify-end">
      <Button
        class="mr-5"
        @click="emit('close')"
      >
        Cancel
      </Button>
      <PrimaryButton @click="edit">
        Add
      </PrimaryButton>
    </div>
    <ConfirmDialog
      :show="shouldShowDeleteDialog"
      danger
      @confirm="() => serverToDelete && deleteServer(serverToDelete)"
      @close="shouldShowDeleteDialog = false"
    >
      Are you sure you want to delete <b>{{ serverToDelete?.name }}</b>?
    </ConfirmDialog>
    <ServerModal
      :show="shouldShowServerModal"
      :server-key="serverToEdit"
      @close="shouldShowServerModal = !serversStore.hasServers"
    />
  </AppModal>
</template>
