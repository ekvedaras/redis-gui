<template>
  <div class="flex">
    <TimeIcon class="w-5"/>
    <span class="ml-2" v-if="seconds < 60">Expires in {{ [seconds, 'seconds'] | duration('as', 'seconds') }} seconds</span>
    <span class="ml-2" v-else>Expires in {{ [seconds, 'seconds'] | duration('humanize') }}</span>
  </div>
</template>

<script>
import TimeIcon from '@/components/Icons/TimeIcon'

export default {
  name: 'TTL',
  components: { TimeIcon },
  props: ['seconds'],
}
</script>

<style scoped>

</style>
