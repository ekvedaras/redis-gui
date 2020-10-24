<template>
  <div :class="{'text-redis': log.isError, 'font-bold': log.wasSent}">
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
