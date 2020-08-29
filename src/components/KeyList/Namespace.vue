<template>
  <div>
    <div class="flex cursor-pointer hover:bg-white-10p px-2" tabindex="1" @keypress.enter="toggle" @click="toggle">
      <LevelTab :level="level"></LevelTab>
      <OpenFolderIcon v-if="expanded" class="w-5"/>
      <FolderIcon v-else class="w-5"/>
      <div class="ml-2">{{ namespace }}</div>
    </div>
    <Keys v-if="expanded" :keys="keys" :level="level + 1"/>
  </div>
</template>

<script>
import FolderIcon from '@/components/Icons/FolderIcon'
import LevelTab from '@/components/KeyList/LevelTab'
import OpenFolderIcon from '@/components/Icons/OpenFolderIcon'
export default {
  name: 'Namespace',
  components: { OpenFolderIcon, LevelTab, FolderIcon },
  props: ['namespace', 'keys', 'level'],
  data: () => ({
    expanded: false,
  }),
  methods: {
    toggle() {
      this.expanded = !this.expanded
    }
  }
}
</script>

<style scoped>

</style>
