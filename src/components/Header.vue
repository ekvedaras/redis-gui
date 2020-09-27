<template>
  <div class="w-full h-full flex justify-between items-center space-x-2 px-2">
    <img src="@/assets/redis.svg" alt="Redis logo" class="h-full"/>
    <h1 class="text-left text-xl font-semibold tracking-widest">Redis GUI</h1>
    <div class="flex-1 flex text-center justify-center items-center">
      <div @click="edit" class="mr-1">
        <EditIcon class="w-6 cursor-pointer"/>
      </div>
      <ServerSelect class="bg-gray-300 rounded p-1"/>
      <div @click="add">
        <AddIcon class="w-8 cursor-pointer"/>
      </div>
      <div @click="refresh">
        <RefreshIcon class="w-8 cursor-pointer"/>
      </div>
    </div>
    <DatabaseSelect class="bg-gray-300 rounded p-1"/>
  </div>
</template>

<script>
import DatabaseSelect from '@/components/DatabaseSelect'
import ServerSelect from '@/components/ServerSelect'
import RefreshIcon from '@/components/Icons/RefreshIcon'
import AddIcon from '@/components/Icons/AddIcon'
import ServerModal from '@/components/Modals/ServerModal'
import EditIcon from '@/components/Icons/EditIcon'
import ServerListModal from '@/components/Modals/ServerListModal'

export default {
  components: { EditIcon, AddIcon, RefreshIcon, ServerSelect, DatabaseSelect },
  methods: {
    refresh() {
      this.$store.dispatch('loadKeys').then(() => this.$toasted.info('Keys refreshed'))
    },
    add() {
      this.$modal.show(ServerModal)
    },
    edit() {
      this.$modal.show(ServerListModal)
    }
  }
}
</script>

<style scoped>

</style>
