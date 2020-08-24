<template>
  <div>
    <div class="flex cursor-pointer hover:bg-gray-200" @click="expanded = !expanded">
      <LevelTab :level="level"></LevelTab>
      <FolderIcon class="w-5 text-gray-600"/>
      <div class="ml-2">{{ namespace }}</div>
    </div>
    <Keys v-if="expanded" :keys="keys" :level="level + 1"/>
  </div>
</template>

<script>
import FolderIcon from '@/components/Icons/FolderIcon'
import LevelTab from '@/components/KeyList/LevelTab'
export default {
  name: 'Namespace',
  components: { LevelTab, FolderIcon },
  props: ['namespace', 'keys', 'level'],
  data: () => ({
    expanded: false,
  })
}
</script>

<style scoped>

</style>
