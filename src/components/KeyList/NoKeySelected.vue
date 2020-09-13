<template>
  <div class="flex flex-col items-center justify-center h-full text-center">
    <div class="text-5xl font-medium text-gray-500">
      {{ host }}
    </div>
    <div class="text-4xl font-medium text-gray-500">
      db{{ currentDatabase }}
    </div>
    <div class="mt-4 text-gray-500">
      Select or <a href="#" @click="showAddKeyModal" class="text-red-500 hover:text-redis hover:underline">add</a> a new key.
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { database } from '@/services/database'
import AddKeyModal from '@/components/Modals/AddKeyModal'

export default {
  name: 'NoKeySelected',
  computed: {
    ...mapState(['server', 'currentDatabase']),
    host() {
      return database.get(`servers.${this.server}.host`)
    }
  },
  methods: {
    showAddKeyModal() {
      this.$modal.show(AddKeyModal)
    }
  }
}
</script>

<style scoped>

</style>
