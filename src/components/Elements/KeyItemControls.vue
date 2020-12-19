<template>
  <div class="absolute h-6 p-0 top-0 right-0 rounded bg-white-80p dark:bg-black-10p dark:group-hover:bg-black-50p text-gray-400 group-hover:text-gray-900 dark:text-gray-700 dark:group-hover:text-gray-500 ">
    <IconButton v-if="!withoutWordBreak" v-tooltip="'Toggle word break'" @click="$emit('toggleWordBreak')" class="z-10">
      <WordBreakIcon class="w-4 m-1"/>
    </IconButton>
    <IconButton v-if="withJson" @click="$emit('toggleJson')">
      <CodeIcon class="w-5" v-tooltip.left="'Toggle JSON view'"/>
    </IconButton>
    <IconButton v-tooltip="'Copy'" @click="$emit('copy')" class="z-10">
      <DocumentIcon class="w-4 m-1"/>
    </IconButton>
    <IconButton v-tooltip="'Edit'" @click="$emit('edit')" class="z-10">
      <EditIcon class="w-4 m-1"/>
    </IconButton>
    <IconButton v-tooltip="'Delete'" v-if="!withoutDelete" @click="$emit('delete')" class="z-10">
      <DeleteIcon class="w-4 m-1"/>
    </IconButton>
  </div>
</template>

<script>
import IconButton from '@/components/Elements/IconButton'
import EditIcon from '@/components/Icons/EditIcon'
import DeleteIcon from '@/components/Icons/DeleteIcon'
import DocumentIcon from '@/components/Icons/DocumentIcon'
import WordBreakIcon from '@/components/Icons/WordBreakIcon'
import CodeIcon from '@/components/Icons/CodeIcon'

export default {
  name: 'KeyItemControls',
  components: { CodeIcon, WordBreakIcon, DocumentIcon, DeleteIcon, EditIcon, IconButton },
  props: {
    withoutDelete: {
      type: Boolean,
      default: false,
    },
    withoutWordBreak: {
      type: Boolean,
      default: false,
    },
    withJson: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>

</style>
