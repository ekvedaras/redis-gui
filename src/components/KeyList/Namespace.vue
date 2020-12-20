<template>
  <div>
    <div class="flex cursor-pointer rounded hover:bg-gray-200 dark:hover:bg-white-10p px-2" tabindex="1" @keypress.enter="toggle" @click="toggle">
      <LevelTab :level="level"></LevelTab>
      <div class="flex items-start">
        <OpenFolderIcon v-if="expanded" class="w-5"/>
        <FolderIcon v-else class="w-5"/>
        <component v-if="overlayIcon" :is="overlayIcon" class="w-4 h-4 rounded bg-white dark:bg-gray-800 shadow mr-1 -ml-2 mt-2"/>
      </div>
      <div class="ml-2">{{ namespaceWithDots }} <span class="text-xs text-gray-500" v-tooltip.top-end="`${totalKeys} keys loaded`">({{ totalKeys }})</span></div>
    </div>
    <Keys v-if="expanded" :keys="keys" :level="level + 1"/>
  </div>
</template>

<script>
import FolderIcon from '@/components/Icons/FolderIcon'
import LevelTab from '@/components/KeyList/LevelTab'
import OpenFolderIcon from '@/components/Icons/OpenFolderIcon'
import LaravelIcon from '@/components/Icons/LaravelIcon'
import HorizonIcon from '@/components/Icons/HorizonIcon'
import { redis } from '@/services/redis'

export default {
  name: 'Namespace',
  components: { OpenFolderIcon, LevelTab, FolderIcon },
  props: ['namespace', 'keys', 'level'],
  data: () => ({
    expanded: false,
  }),
  methods: {
    toggle () {
      this.expanded = !this.expanded
    },
  },
  computed: {
    namespaceWithDots () {
      if (redis.namespaceSeparator === '.') {
        return this.namespace
      }

      return this.namespace.replaceAll('◦', '.')
    },
    overlayIcon () {
      if (this.namespace === 'laravel') {
        return LaravelIcon
      }

      if (this.namespace === 'horizon') {
        return HorizonIcon
      }

      return false
    },
    totalKeys () {
      return Object.keys(this.keys).length
    }
  }
}
</script>

<style scoped>

</style>
