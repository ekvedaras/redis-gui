<script setup lang="ts">
import EditIcon from '/@/components/Icons/EditIcon.vue'
import InfoIcon from '/@/components/Icons/InfoIcon.vue'
import TerminalIcon from '/@/components/Icons/TerminalIcon.vue'
import CogIcon from '/@/components/Icons/CogIcon.vue'
import IconButton from '/@/components/Elements/IconButton.vue'
import RefreshIcon from '/@/components/Icons/RefreshIcon.vue'
import ServerSelect from '/@/components/Elements/ServerSelect.vue'
import DatabaseSelect from '/@/components/Elements/DatabaseSelect.vue'
import { ref, watch } from 'vue'
import SettingsModal from '/@/components/Elements/SettingsModal.vue'
import InfoModal from '/@/components/Elements/InfoModal.vue'
import { useDatabasesStore } from '/@/store/databases'
import { useKeysStore } from '/@/store/keys'
import { useToaster } from '/@/use/toaster'
import ServerListModal from '/@/components/Elements/ServerListModal.vue'
import ConsoleModal from '/@/components/Elements/ConsoleModal.vue'
import ShortKeyModal from '/@/components/Elements/ShortKeyModal.vue'
import { useServersStore } from '/@/store/servers'

const serversStore = useServersStore()

const shouldShowServerListModal = ref(!serversStore.hasServers)
const shouldShowInfoModal = ref(false)
const shouldShowConsoleModal = ref(false)
const shouldShowSettingsModal = ref(false)
const shouldShowShortKeysModal = ref(false)

watch(() => serversStore.hasServers, () => shouldShowServerListModal.value = !serversStore.hasServers)

const databasesStore = useDatabasesStore()
const keysStore = useKeysStore()
const toaster = useToaster()
const refresh = async () => {
  await Promise.all([databasesStore.load(), keysStore.loadKeys()])
  toaster.info('Keys refreshed')
}
</script>

<template>
  <div class="w-full flex justify-between items-center space-x-2 px-2 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <div class="py-2 h-full">
      <img
        src="/@/../assets/redis.svg"
        alt="Redis logo"
        class="h-full"
      >
    </div>
    <h1 class="text-left text-xl font-semibold tracking-widest">
      Redis GUI
    </h1>
    <div v-shortkey="['shift', '?']" class="flex-1 space-x-2 flex text-center justify-center items-center" @shortkey="shouldShowShortKeysModal = true">
      <ServerSelect />
      <IconButton v-tooltip="'Edit saved redis servers'" @click="shouldShowServerListModal = true">
        <EditIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton v-tooltip="'Refresh key list and database information'" v-shortkey="['ctrl', 'r']" @click="refresh" @shortkey="refresh">
        <RefreshIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton v-tooltip="'Redis console'" v-shortkey="['c']" @click="shouldShowConsoleModal = true" @shortkey="shouldShowConsoleModal = true">
        <TerminalIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton v-if="databasesStore.infoAllowed" v-tooltip="'Show server info and statistics'" v-shortkey="['i']" @click="shouldShowInfoModal = true" @shortkey="shouldShowInfoModal = true">
        <InfoIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton v-tooltip="'Settings'" v-shortkey="['s']" @click="shouldShowSettingsModal = true" @shortkey="shouldShowSettingsModal = true">
        <CogIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
    </div>
    <DatabaseSelect v-tooltip="'Choose redis database'" class="bg-gray-300 dark:bg-gray-700 rounded p-1" />
    <ServerListModal v-if="shouldShowServerListModal" @close="shouldShowServerListModal = false" />
    <InfoModal v-if="databasesStore.infoAllowed && shouldShowInfoModal" @close="shouldShowInfoModal = false" />
    <ConsoleModal v-if="shouldShowConsoleModal" @close="shouldShowConsoleModal = false" />
    <SettingsModal v-if="shouldShowSettingsModal" @close="shouldShowSettingsModal = false" />
    <ShortKeyModal v-if="shouldShowShortKeysModal" @close="shouldShowShortKeysModal = false" />
  </div>
</template>
