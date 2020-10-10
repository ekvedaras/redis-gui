<template>
  <div class="flex flex-col items-center justify-center h-full text-center">
    <div class="text-5xl font-medium text-gray-500">
      {{ selectedHost }}
    </div>
    <div class="text-4xl font-medium text-gray-500">
      db{{ selectedDatabase }}
    </div>
    <div class="mt-4 text-gray-500">
      Select or <a href="#" @click="showAddKeyModal" class="text-red-500 hover:text-redis hover:underline">add</a> a new key.
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import AddKeyModal from '@/components/Modals/AddKeyModal'

export default {
  name: 'NoKeySelected',
  computed: {
    ...mapState('databases', { selectedDatabase: 'selected' }),
    ...mapGetters('servers', ['selectedHost']),
  },
  methods: {
    showAddKeyModal () {
      this.$modal.show(AddKeyModal)
    },
  },
}
</script>

<style scoped>

</style>
