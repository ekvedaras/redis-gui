<template>
  <div class="w-full h-full flex justify-between items-center space-x-2 px-2">
    <img src="@/assets/redis.svg" alt="Redis logo" class="h-full"/>
    <h1 class="text-left text-xl font-semibold tracking-widest">Redis GUI</h1>
    <div class="flex-1 space-x-2 flex text-center justify-center items-center">
      <ServerSelect class="bg-gray-300 rounded p-1"/>
      <IconButton @click="add" class="text-gray-900">
        <AddIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
      <IconButton @click="edit" class="text-gray-900">
        <EditIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
      <IconButton @click="refresh" class="text-gray-900">
        <RefreshIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
      <IconButton @click="openTerminal" class="text-gray-900">
        <TerminalIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
      <IconButton @click="openSettings" class="text-gray-900">
        <CogIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
    </div>
    <DatabaseSelect class="bg-gray-300 rounded p-1"/>
  </div>
</template>

<script>
import DatabaseSelect from '@/components/Elements/DatabaseSelect'
import ServerSelect from '@/components/Elements/ServerSelect'
import RefreshIcon from '@/components/Icons/RefreshIcon'
import AddIcon from '@/components/Icons/AddIcon'
import ServerModal from '@/components/Modals/ServerModal'
import EditIcon from '@/components/Icons/EditIcon'
import ServerListModal from '@/components/Modals/ServerListModal'
import TerminalIcon from '@/components/Icons/TerminalIcon'
import ConsoleModal from '@/components/Modals/ConsoleModal'
import { mapActions } from 'vuex'
import IconButton from '@/components/Elements/IconButton'
import CogIcon from '@/components/Icons/CogIcon'
import SettingsModal from '@/components/Modals/SettingsModal'

export default {
  components: { CogIcon, IconButton, TerminalIcon, EditIcon, AddIcon, RefreshIcon, ServerSelect, DatabaseSelect },
  methods: {
    ...mapActions('keys', ['loadKeys']),
    refresh () {
      this.loadKeys().then(() => this.$toasted.info('Keys refreshed'))
    },
    add () {
      this.$modal.show(ServerModal)
    },
    edit () {
      this.$modal.show(ServerListModal)
    },
    openTerminal () {
      this.$modal.show(ConsoleModal)
    },
    openSettings() {
      this.$modal.show(SettingsModal)
    }
  },
}
</script>

<style scoped>

</style>
