<script setup lang="ts">
import { useDatabasesStore } from '/@/store/databases'
import { useServersStore } from '/@/store/servers'
import AddKeyModal from '/@/components/Elements/AddKeyModal.vue'
import { ref } from 'vue'
import { useServerRepresenter } from '/@/use/serverRepresenter'

const databasesStore = useDatabasesStore()
const serversStore = useServersStore()
const {representServer} = useServerRepresenter()

const showAddKeyModal = ref(false)
</script>

<template>
  <div v-if="serversStore.connected" class="flex flex-col items-center justify-center h-full text-center">
    <div class="text-5xl font-medium text-gray-500">
      {{ representServer(serversStore.list[serversStore.selected]) }}
    </div>
    <div class="text-4xl font-medium text-gray-500">
      db{{ databasesStore.selected ?? 0 }}
    </div>
    <div class="mt-4 text-gray-500">
      Select or <a href="#" class="text-red-500 hover:text-redis hover:underline" @click="showAddKeyModal = true">add</a> a new key.
    </div>
    <AddKeyModal v-if="showAddKeyModal" @close="showAddKeyModal = false" />
  </div>
</template>
