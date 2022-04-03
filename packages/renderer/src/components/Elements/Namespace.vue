<script setup lang="ts">
import Keys from './Keys.vue'
import type { Key } from '../../../types/redis'
import { computed, ref } from 'vue'
import { useRedis } from '/@/use/redis'
import OpenFolderIcon from '/@/components/Icons/OpenFolderIcon.vue'
import FolderIcon from '/@/components/Icons/FolderIcon.vue'
import LaravelIcon from '/@/components/Icons/LaravelIcon.vue'
import HorizonIcon from '/@/components/Icons/HorizonIcon.vue'
import LevelTab from '/@/components/Elements/LevelTab.vue'
import { useKeysStore } from '/@/store/keys'

export type NamespaceProps = {
  namespace: string;
  keys: Record<string, Key>;
  level: number;
}

const props = defineProps<NamespaceProps>()

const redis = useRedis()

const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value

const namespaceWithDots = computed(() => {
  if (redis.namespaceSeparator === '.') {
    return props.namespace
  }

  return props.namespace.replaceAll('◦', '.')
})

const overlayIcon = computed(() => {
  if (props.namespace === 'laravel') {
    return LaravelIcon
  }

  if (props.namespace === 'horizon') {
    return HorizonIcon
  }

  return false
})

const totalKeys = computed(() => Object.keys(props.keys).length)

const keysStore = useKeysStore()
const namespaceForSelection = computed(() => `${namespaceWithDots.value}${redis.namespaceSeparator}*`)
const toggleNamespaceSelection = (namespace: string) => {
  const index = keysStore.selectedKeys.indexOf(namespace)

  if (index === -1) {
    const newList : string[] = [namespace]
    keysStore.selectedKeys.forEach((key, index) => {
      if (!(keysStore.selectedKeys[index].substring(0, namespace.length - 2) === namespace.substring(0, namespace.length - 2))) {
        newList.push(key)
      }
    })
    keysStore.selectedKeys = newList
  } else {
    keysStore.selectedKeys.splice(index, 1)
  }
}
</script>

<template>
  <div>
    <div
      class="flex items-center cursor-pointer rounded hover:bg-gray-200 dark:hover:bg-white-10p px-2"
      tabindex="1"
      @keypress.enter="toggle"
      @click="toggle"
    >
      <LevelTab :level="level" />
      <input v-if="keysStore.checkboxesVisible" :key="keysStore.selectedKeys" type="checkbox" :checked="keysStore.isKeySelected(namespaceForSelection)" class="mr-1" @click.stop="toggleNamespaceSelection(namespaceForSelection)" />
      <div class="flex items-start">
        <OpenFolderIcon
          v-if="expanded"
          class="w-5"
        />
        <FolderIcon
          v-else
          class="w-5"
        />
        <component
          :is="overlayIcon"
          v-if="overlayIcon"
          class="w-4 h-4 rounded bg-white dark:bg-gray-800 shadow mr-1 -ml-2 mt-2"
        />
      </div>
      <div class="ml-2">
        {{ namespaceWithDots }} <span class="text-xs text-gray-500">({{ totalKeys }})</span>
      </div>
    </div>
    <Keys
      v-if="expanded"
      :keys="keys"
      :level="level + 1"
    />
  </div>
</template>
