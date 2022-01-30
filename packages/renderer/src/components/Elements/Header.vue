<template>
  <div class="w-full flex justify-between items-center space-x-2 px-2">
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
    <div class="flex-1 space-x-2 flex text-center justify-center items-center">
      <ServerSelect />
      <IconButton @click="shouldShowServerListModal = true" v-tooltip="'Edit saved redis servers'">
        <EditIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton @click="refresh" v-tooltip="'Refresh key list and database information'">
        <RefreshIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton @click="shouldShowConsoleModal = true" v-tooltip="'Redis console'">
        <TerminalIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton @click="shouldShowInfoModal = true" v-tooltip="'Show server info and statistics'">
        <InfoIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton @click="shouldShowSettingsModal = true" v-tooltip="'Settings'">
        <CogIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
    </div>
    <DatabaseSelect class="bg-gray-300 dark:bg-gray-700 rounded p-1" v-tooltip="'Choose redis database'" />
    <ServerListModal v-model:show="shouldShowServerListModal" />
    <InfoModal v-model:show="shouldShowInfoModal" />
    <ConsoleModal v-model:show="shouldShowConsoleModal" />
    <SettingsModal v-model:show="shouldShowSettingsModal" />
    <ShortKeyModal v-model:show="shouldShowShortKeysModal" />
  </div>
</template>

<script setup lang="ts">
import EditIcon from '/@/components/Icons/EditIcon.vue'
import InfoIcon from '/@/components/Icons/InfoIcon.vue'
import TerminalIcon from '/@/components/Icons/TerminalIcon.vue'
import CogIcon from '/@/components/Icons/CogIcon.vue'
import IconButton from '/@/components/Elements/IconButton.vue'
import RefreshIcon from '/@/components/Icons/RefreshIcon.vue'
import ServerSelect from '/@/components/Elements/ServerSelect.vue'
import DatabaseSelect from '/@/components/Elements/DatabaseSelect.vue'
import { onMounted, ref } from 'vue'
import SettingsModal from '/@/components/Elements/SettingsModal.vue'
import InfoModal from '/@/components/Elements/InfoModal.vue'
import { useDatabasesStore } from '/@/store/databases'
import { useKeysStore } from '/@/store/keys'
import { useToaster } from '/@/use/toaster'
import useHotKey from 'vue3-hotkey'
import ServerListModal from '/@/components/Elements/ServerListModal.vue'
import ConsoleModal from '/@/components/Elements/ConsoleModal.vue'
import ShortKeyModal from '/@/components/Elements/ShortKeyModal.vue'

const shouldShowServerListModal = ref(false)
const shouldShowInfoModal = ref(false)
const shouldShowConsoleModal = ref(false)
const shouldShowSettingsModal = ref(false)
const shouldShowShortKeysModal = ref(false)

const databasesStore = useDatabasesStore()
const keysStore = useKeysStore()
const toaster = useToaster()
const refresh = async () => {
  await Promise.all([databasesStore.load(), keysStore.loadKeys()])
  toaster.info('Keys refreshed')
}

onMounted(() => useHotKey([
  {
    keys: ['shift', '?'],
    preventDefault: true,
    handler: () => shouldShowShortKeysModal.value = true,
  },
  {
    keys: ['ctrl', 'r'],
    preventDefault: true,
    handler: () => refresh(),
  },
  {
    keys: ['c'],
    preventDefault: true,
    handler: () => shouldShowConsoleModal.value = true,
  },
  {
    keys: ['i'],
    preventDefault: true,
    handler: () => shouldShowInfoModal.value = true,
  },
  {
    keys: ['s'],
    preventDefault: true,
    handler: () => shouldShowSettingsModal.value = true,
  },
]))
</script>
