<template>
  <div class="relative" :class="{'text-redis': log.isError, 'sent-command border-b z-10 border-gray-200 dark:border-gray-800 mb-2 -mx-4 font-bold sticky py-2 px-4 top-0 shadow-sm bg-white dark:bg-black': log.wasSent}">
    <IconButton v-if="!log.wasSent" class="absolute top-0 right-0" @click="collapsed = !collapsed">
      <DownIcon v-if="collapsed" class="w-5" v-tooltip="'Expand'"/>
      <UpIcon v-else class="w-5" v-tooltip="'Collapse'"/>
    </IconButton>
    <div :class="{'h-6 overflow-hidden': collapsed}">
      <div v-if="typeof log.content === 'object'">
        <p v-for="(entry, index) in log.content" :key="index">
          {{ index }}) {{ entry }}
        </p>
      </div>
      <p v-else-if="log.wasSent">
        > {{ log.content }}
      </p>
      <p v-else>
        {{ log.content }}
      </p>
    </div>
    <div v-if="collapsed" v-tooltip="'Expand'" @click="collapsed = false" class="inline cursor-pointer leading-none collapse-indicator rounded text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-900 px-2">
      •••
    </div>
  </div>
</template>

<script>
import { ConsoleLog } from '@/models/ConsoleLog'
import IconButton from '@/components/Elements/IconButton'
import DownIcon from '@/components/Icons/DownIcon'
import UpIcon from '@/components/Icons/UpIcon'

export default {
  name: 'ConsoleLogLine',
  components: { UpIcon, DownIcon, IconButton },
  props: {
    log: {
      type: ConsoleLog,
    },
  },
  data: () => ({
    collapsed: false,
  })
}
</script>

<style scoped>
  div.collapse-indicator {
    font-size: .7rem;
  }
</style>
