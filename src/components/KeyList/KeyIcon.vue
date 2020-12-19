<template>
  <div class="flex items-center">
    <component :is="icon" class="w-5"/>
    <component v-if="overlayIcon" :is="overlayIcon" class="w-4 h-4 rounded bg-white dark:bg-gray-800 shadow mr-1 -ml-1 -mb-2"/>
  </div>
</template>

<script>
import StringIcon from '@/components/Icons/StringIcon'
import ZsetIcon from '@/components/Icons/ZsetIcon'
import SetIcon from '@/components/Icons/SetIcon'
import ListIcon from '@/components/Icons/ListIcon'
import HashIcon from '@/components/Icons/HashIcon'
import LaravelIcon from '@/components/Icons/LaravelIcon'
import HorizonIcon from '@/components/Icons/HorizonIcon'

export default {
  name: 'KeyIcon',
  props: ['redisKey'],
  computed: {
    icon () {
      switch (this.redisKey.type) {
        case 'string':
          return StringIcon
        case 'zset':
          return ZsetIcon
        case 'set':
          return SetIcon
        case 'list':
          return ListIcon
        case 'hash':
          return HashIcon
        default:
          return StringIcon
      }
    },
    overlayIcon () {
      if (this.redisKey.name.match(/^laravel:(.+)/)) {
        return LaravelIcon
      }

      if (this.redisKey.name.match(/^queues:(.+):(.+)/)) {
        return LaravelIcon
      }

      if (this.redisKey.name.match(/^horizon:(.+)/)) {
        return HorizonIcon
      }

      return false
    },
  }
}
</script>

<style scoped>

</style>
