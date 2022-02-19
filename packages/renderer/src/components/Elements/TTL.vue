<script setup lang="ts">
import type { Key } from 'types/redis'
import { computed, nextTick, ref } from 'vue'
import { useKeysStore } from '/@/store/keys'
import { useRedis } from '/@/use/redis'
import TimeIcon from '/@/components/Icons/TimeIcon.vue'

const props = defineProps<{
  redisKey: Key,
}>()

const keysStore = useKeysStore()
const redis = useRedis()

const isEditing = ref(false)
const newTtl = ref(0)
const ttlField = ref<HTMLInputElement>()
const ttlText = ref<HTMLDivElement>()
const seconds = computed(() => props.redisKey.ttl || 0)

const startEditing = () => {
  isEditing.value = true
  newTtl.value = seconds.value
  nextTick(() => ttlField.value?.focus())
}

const edit = async (save: boolean) => {
  if (save && isEditing.value && newTtl.value !== props.redisKey.ttl) {
    if (newTtl.value < 1) {
      try {
        await redis.client.persist(props.redisKey.name)
        keysStore.list[props.redisKey.name] = { ...props.redisKey, ttl: -1 }
      } finally {
        isEditing.value = false
        nextTick(() => ttlText.value?.focus())
      }
    } else {
      try {
        await redis.client.expireAt(props.redisKey.name, newTtl.value)
        keysStore.list[props.redisKey.name] = { ...props.redisKey, ttl: newTtl.value }
      } finally {
        isEditing.value = false
        nextTick(() => ttlText.value?.focus())
      }
    }
  } else {
    isEditing.value = false
    nextTick(() => ttlText.value?.focus())
  }
}
</script>

<template>
  <div class="flex">
    <div
      ref="ttlText"
      v-tooltip="{ content: 'Set TTL (Time To Live) in seconds. Use <code><b>-1</b></code> to disable.', html: true}"
      v-shortkey="['t']"
      tabindex="0"
      class="flex cursor-pointer rounded text-gray-500 hover:bg-red-200 focus:bg-red-200 hover:text-redis dark:hover:bg-redis-700 dark:focus:bg-redis-700 dark:hover:text-redis-300 focus:text-redis"
      :class="{'text-gray-500': redisKey.ttl < 1}"
      @shortkey="startEditing"
      @keydown.enter="startEditing"
      @click="startEditing"
    >
      <TimeIcon class="w-4 m-1" />
      <div v-show="!isEditing" v-if="redisKey.ttl > -1">
        <span v-if="seconds < 60" class="ml-2">Expires in TODO<!-- {{ [seconds, 'seconds'] | duration('as', 'seconds') }} seconds--></span>
        <span v-else class="ml-2">Expires in TODO<!--{{ [seconds, 'seconds'] | duration('humanize') }}--></span>
      </div>
    </div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <input v-show="isEditing" ref="ttlField" v-model="newTtl" type="text" placeholder="TTL seconds" class="text-sm py-0 px-2" @keydown.esc="edit(false)" @keydown.enter="edit(true)" @blur="edit(true)" />
  </div>
</template>
