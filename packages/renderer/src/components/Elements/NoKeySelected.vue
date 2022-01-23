<template>
  <div class="flex flex-col items-center justify-center h-full text-center">
    <div class="text-5xl font-medium text-gray-500">
      {{ serversStore.selectedHost }}
    </div>
    <div class="text-4xl font-medium text-gray-500">
      db{{ databasesStore.selected ?? 0 }}
    </div>
    <div class="mt-4 text-gray-500">
      Select or <a href="#" @click="showAddKeyModal = true" class="text-red-500 hover:text-redis hover:underline">add</a> a new key.
    </div>
    <AddKeyModal v-model:show="showAddKeyModal" />
  </div>
</template>

<script setup lang="ts">
import { useDatabasesStore } from '/@/store/databases'
import { useServersStore } from '/@/store/servers'
import AddKeyModal from '/@/components/Elements/AddKeyModal.vue'
import { ref } from 'vue'

const databasesStore = useDatabasesStore()
const serversStore = useServersStore()

const showAddKeyModal = ref(false)
</script>

<style scoped>

</style>
