<template>
  <div class="flex items-center">
    <component
      :is="icon"
      class="w-5"
    />
    <component
      :is="overlayIcon"
      v-if="overlayIcon"
      class="w-4 h-4 rounded bg-white dark:bg-gray-800 shadow mr-1 -ml-1 -mb-2"
    />
  </div>
</template>

<script setup lang="ts">
import type { Key } from '../../../types/redis'
import { computed } from 'vue'
import StringIcon from '../icons/StringIcon.vue'
import ZsetIcon from '../icons/ZsetIcon.vue'
import SetIcon from '../icons/SetIcon.vue'
import ListIcon from '../icons/ListIcon.vue'
import HashIcon from '../icons/HashIcon.vue'
import LaravelIcon from '../icons/LaravelIcon.vue'
import HorizonIcon from '../icons/HorizonIcon.vue'

const props = defineProps<{
  redisKey: Key,
}>()

const icon = computed(() => {
  switch (props.redisKey.type) {
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
})

const overlayIcon = computed(() => {
  if (props.redisKey.name.match(/^laravel:(.+)/)) {
    return LaravelIcon
  }

  if (props.redisKey.name.match(/^queues:(.+):(.+)/)) {
    return LaravelIcon
  }

  if (props.redisKey.name.match(/^horizon:(.+)/)) {
    return HorizonIcon
  }

  return false
})
</script>

<style scoped>

</style>
