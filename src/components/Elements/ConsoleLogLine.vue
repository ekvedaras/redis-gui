<template>
  <div class="overflow-x-auto relative" :class="{'text-redis': log.isError, 'sent-command rounded-t border-b z-10 border-gray-200 dark:border-gray-800 mb-2 -mx-4 font-bold sticky py-2 px-4 top-0 shadow-sm bg-white dark:bg-black': log.wasSent}">
    <div class="absolute top-0 right-0 bg-white-80p dark:bg-black-50p rounded flex items-center" :class="{'mt-2 mr-2': log.wasSent}">
      <IconButton v-if="!log.wasSent" @click="collapsed = !collapsed">
        <DownIcon v-if="collapsed" class="w-5" v-tooltip.left="'Expand'"/>
        <UpIcon v-else class="w-5" v-tooltip.left="'Collapse'"/>
      </IconButton>
      <IconButton v-if="log.wasSent" @click="$emit('rerun', log.content)">
        <RefreshIcon class="w-5" v-tooltip.left="'Run again'"/>
      </IconButton>
      <IconButton @click="copy">
        <DocumentIcon class="w-5" v-tooltip.left="'Copy'"/>
      </IconButton>
    </div>
    <div :class="{'h-6 overflow-hidden': collapsed}">
      <div v-if="typeof log.content === 'object'">
        <p v-for="(entry, index) in log.content" :key="index">
          {{ index }}) {{ entry }}
        </p>
      </div>
      <div v-else-if="log.wasSent">
        > {{ log.content }}
      </div>
      <div v-else class="whitespace-pre">
        {{ log.content }}
      </div>
    </div>
    <div v-if="collapsed" v-tooltip.right="'Expand'" @click="collapsed = false" class="inline cursor-pointer leading-none collapse-indicator rounded text-gray-500 dark:text-gray-600 bg-gray-200 dark:bg-gray-900 px-2">
      •••
    </div>
  </div>
</template>

<script>
import { ConsoleLog } from '@/models/ConsoleLog'
import IconButton from '@/components/Elements/IconButton'
import DownIcon from '@/components/Icons/DownIcon'
import UpIcon from '@/components/Icons/UpIcon'
import RefreshIcon from '@/components/Icons/RefreshIcon'
import DocumentIcon from '@/components/Icons/DocumentIcon'

export default {
  name: 'ConsoleLogLine',
  components: { DocumentIcon, RefreshIcon, UpIcon, DownIcon, IconButton },
  props: {
    log: {
      type: ConsoleLog,
    },
  },
  data: () => ({
    collapsed: false,
  }),
  methods: {
    copy() {
      this.$copyText(this.log.content)
      this.$toasted.info('Copied');
    }
  }
}
</script>

<style scoped>
div.collapse-indicator {
  font-size: .7rem;
}
</style>
