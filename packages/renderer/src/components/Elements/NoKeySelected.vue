<template>
  <div class="flex flex-col items-center justify-center h-full text-center">
    <div class="text-5xl font-medium text-gray-500">
      {{ serversStore.selectedHost }}
    </div>
    <div class="text-4xl font-medium text-gray-500">
      db{{ databasesStore.selected }}
    </div>
    <div class="mt-4 text-gray-500">
      Select or <a href="#" @click="showAddKeyModal" class="text-red-500 hover:text-redis hover:underline">add</a> a new key.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDatabasesStore } from '/@/store/databases'
import { useServersStore } from '/@/store/servers'

const databasesStore = useDatabasesStore()
const serversStore = useServersStore()

const showAddKeyModal = () => {
  alert('Show add key modal (TODO)')
  // this.$modal.show(AddKeyModal)
}
</script>

<style scoped>

</style>
