<script setup lang="ts">
import { useKeysStore } from '/@/store/keys'
import { computed, nextTick } from 'vue'
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

const toggleKeySelection = (key: string) => {
  if (keysStore.isKeySelected(key)) {
    const index = keysStore.selectedKeys.indexOf(key)
    if (index === -1) {
      const namespace = keysStore.selectedKeys.find(selectedKey => selectedKey.substring(selectedKey.length - 1) === '*' && selectedKey.substring(0, selectedKey.length - 2) === key.substring(0, selectedKey.length - 2))
      if (namespace) {
        const namespaceIndex = keysStore.selectedKeys.indexOf(namespace)
        keysStore.selectedKeys.splice(namespaceIndex, 1)

        Object.keys(keysStore.list).forEach(storeKey => {
          if (storeKey !== key && namespace.substring(0, namespace.length - 2) === storeKey.substring(0, namespace.length - 2)) {
            keysStore.selectedKeys.push(storeKey)
          }
        })
      }
    } else {
      keysStore.selectedKeys.splice(index, 1)
    }
  } else {
    keysStore.selectedKeys.push(key)
  }
}
</script>

<template>
  <div
    class="flex items-center rounded cursor-pointer px-2 hover:bg-gray-200 dark:hover:bg-white-10p"
    :class="{'font-bold text-redis': isSelected}"
    tabindex="1"
    @keypress.enter="keysStore.selected = redisKey.name"
    @click="keysStore.selected = redisKey.name"
  >
    <LevelTab :level="level" />
    <input v-if="keysStore.checkboxesVisible" :key="keysStore.selectedKeys" type="checkbox" :checked="keysStore.isKeySelected(redisKey.name)" class="mr-1" @click.stop="toggleKeySelection(redisKey.name)" />
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
