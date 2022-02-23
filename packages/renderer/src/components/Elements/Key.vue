<script setup lang="ts">
import { useKeysStore } from '/@/store/keys'
import { computed } from 'vue'
import type { Key } from 'types/redis'
import { useRedis } from '/@/use/redis'
import TimeIcon from '/@/components/Icons/TimeIcon.vue'
import KeyIcon from '/@/components/Elements/KeyIcon.vue'
import LevelTab from '/@/components/Elements/LevelTab.vue'
import { useTime } from '/@/use/time'

const props = defineProps<{
  redisKey: Key,
  name: string,
  level: number,
}>()

const redis = useRedis()
const keysStore = useKeysStore()
const nameWithDots = computed(() => {
  if (redis.namespaceSeparator === '.') {
    return props.name
  }

  return props.name.replaceAll('◦', '.')
})

const isSelected = computed(() => {
  return keysStore.current && props.redisKey.name === keysStore.current.name
})

const time = useTime()
const expiresIn = computed(() => {
  return `Expires in ${ time().add(props.redisKey.ttl, 's').fromNow() }`
})
</script>

<template>
  <div
    class="flex items-start rounded cursor-pointer px-2 hover:bg-gray-200 dark:hover:bg-white-10p"
    :class="{'font-bold text-redis': isSelected}"
    tabindex="1"
    @keypress.enter="keysStore.selected = redisKey.name"
    @click="keysStore.selected = redisKey.name"
  >
    <LevelTab :level="level" />
    <KeyIcon v-tooltip="redisKey.type" :redis-key="redisKey" />
    <div class="ml-2 flex-1">
      {{ nameWithDots }}
    </div>
    <TimeIcon
      v-if="redisKey.ttl > -1"
      v-tooltip="expiresIn"
      class="w-3 mt-1-5 text-gray-600"
      :style="{minWidth: '0.75rem'}"
    />
  </div>
</template>
