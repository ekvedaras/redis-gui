<template>
  <div class="w-full h-full flex justify-between items-center space-x-2 px-2">
    <div class="py-2 h-full">
      <img src="@/assets/redis.svg" alt="Redis logo" class="h-full"/>
    </div>
    <h1 class="text-left text-xl font-semibold tracking-widest">Redis GUI</h1>
    <div class="flex-1 space-x-2 flex text-center justify-center items-center" v-shortkey="['shift', '?']" @shortkey="openShortKeys">
      <ServerSelect/>
      <IconButton @click="edit" v-tooltip="'Edit saved redis servers'">
        <EditIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
      <IconButton @click="refresh" v-shortkey="['ctrl', 'r']" @shortkey.native="refresh" v-tooltip="'Refresh key list and database information'">
        <RefreshIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
      <IconButton @click="openTerminal" v-shortkey="['c']" @shortkey.native="openTerminal" v-tooltip="'Redis console'">
        <TerminalIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
      <IconButton @click="openInfo" v-shortkey="['i']" @shortkey.native="openInfo" v-tooltip="'Show server info and statistics'">
        <InfoIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
      <IconButton @click="openSettings" v-shortkey="['s']" @shortkey.native="openSettings" v-tooltip="'Settings'">
        <CogIcon class="w-6 m-1 cursor-pointer"/>
      </IconButton>
    </div>
    <DatabaseSelect class="bg-gray-300 dark:bg-gray-700 rounded p-1" v-tooltip="'Choose redis database'"/>
  </div>
</template>

<script>
import DatabaseSelect from '@/components/Elements/DatabaseSelect'
import ServerSelect from '@/components/Elements/ServerSelect'
import RefreshIcon from '@/components/Icons/RefreshIcon'
import EditIcon from '@/components/Icons/EditIcon'
import ServerListModal from '@/components/Modals/ServerListModal'
import TerminalIcon from '@/components/Icons/TerminalIcon'
import ConsoleModal from '@/components/Modals/ConsoleModal'
import { mapActions } from 'vuex'
import IconButton from '@/components/Elements/IconButton'
import CogIcon from '@/components/Icons/CogIcon'
import SettingsModal from '@/components/Modals/SettingsModal'
import InfoIcon from '@/components/Icons/InfoIcon'
import InfoModal from '@/components/Modals/InfoModal'
import ShortKeyModal from '@/components/Modals/ShortKeyModal'

export default {
  components: { InfoIcon, CogIcon, IconButton, TerminalIcon, EditIcon, RefreshIcon, ServerSelect, DatabaseSelect },
  methods: {
    ...mapActions('keys', ['loadKeys']),
    ...mapActions('databases', ['load']),
    openInfo () {
      this.$modal.show(InfoModal)
    },
    async refresh () {
      await Promise.all([this.load(), this.loadKeys()])
      this.$toasted.info('Keys refreshed')
    },
    edit () {
      this.$modal.show(ServerListModal)
    },
    openTerminal () {
      this.$modal.show(ConsoleModal)
    },
    openSettings () {
      this.$modal.show(SettingsModal)
    },
    openShortKeys () {
      this.$modal.show(ShortKeyModal)
    },
  },
}
</script>

<style scoped>

</style>
