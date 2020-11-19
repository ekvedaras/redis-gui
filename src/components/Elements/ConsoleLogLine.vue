<template>
  <div :class="{'text-redis': log.isError, 'sent-command border-b border-gray-200 dark:border-gray-800 mb-2 -mx-4 font-bold sticky py-2 px-4 top-0 shadow-sm bg-white dark:bg-black': log.wasSent}">
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
</template>

<script>
import { ConsoleLog } from '@/models/ConsoleLog'

export default {
  name: 'ConsoleLogLine',
  props: {
    log: {
      type: ConsoleLog,
    },
  },
}
</script>

<style scoped>

</style>
