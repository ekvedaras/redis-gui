<template>
  <div>
    <div class="flex cursor-pointer hover:bg-white-10p px-2" tabindex="1" @keypress.enter="toggle" @click="toggle">
      <LevelTab :level="level"></LevelTab>
      <div class="flex items-center">
        <OpenFolderIcon v-if="expanded" class="w-5"/>
        <FolderIcon v-else class="w-5"/>
        <component v-if="overlayIcon" :is="overlayIcon" class="w-4 h-4 rounded bg-white dark:bg-gray-800 shadow mr-1 -ml-2 -mb-2"/>
      </div>
      <div class="ml-2">{{ namespace }}</div>
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
    overlayIcon () {
      if (this.namespace === 'laravel') {
        return LaravelIcon
      }

      if (this.namespace === 'horizon') {
        return HorizonIcon
      }

      return false
    },
  }
}
</script>

<style scoped>

</style>
