<template>
  <div class="w-full flex justify-between items-center space-x-2 px-2">
    <div class="py-2 h-full">
      <img src="/@/../assets/redis.svg" alt="Redis logo" class="h-full" />
    </div>
    <h1 class="text-left text-xl font-semibold tracking-widest">Redis GUI</h1>
    <div class="flex-1 space-x-2 flex text-center justify-center items-center">
      <ServerSelect />
      <IconButton>
        <EditIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton>
        <RefreshIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton>
        <TerminalIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton>
        <InfoIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
      <IconButton>
        <CogIcon class="w-6 m-1 cursor-pointer" />
      </IconButton>
    </div>
    <DatabaseSelect class="bg-gray-300 dark:bg-gray-700 rounded p-1" />
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
import DatabaseSelect from '/@/components/Elements/DatabaseSelect.vue'</script>
