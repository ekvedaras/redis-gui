<template>
  <div class="absolute h-6 p-0 top-0 right-0 rounded bg-white-80p dark:bg-black-10p dark:group-hover:bg-black-50p text-gray-400 group-hover:text-gray-900 dark:text-gray-700 dark:group-hover:text-gray-500 ">
    <IconButton v-if="!withoutWordBreak" v-tooltip="'Toggle word break'" class="z-10" @click="emit('toggleWordBreak')">
      <WordBreakIcon class="w-4 m-1" />
    </IconButton>
    <IconButton v-if="withJson" @click="emit('toggleJson')">
      <CodeIcon v-tooltip.left="'Toggle JSON view'" class="w-5" />
    </IconButton>
    <IconButton v-tooltip="'Copy'" class="z-10" @click="emit('copy')">
      <DocumentIcon class="w-4 m-1" />
    </IconButton>
    <IconButton v-tooltip="'Edit'" class="z-10" @click="emit('edit')">
      <EditIcon class="w-4 m-1" />
    </IconButton>
    <IconButton v-if="!withoutDelete" v-tooltip="'Delete'" class="z-10" @click="emit('delete')">
      <DeleteIcon class="w-4 m-1" />
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import IconButton from '/@/components/Elements/IconButton.vue'
import WordBreakIcon from '/@/components/Icons/WordBreakIcon.vue'
import CodeIcon from '/@/components/Icons/CodeIcon.vue'
import DocumentIcon from '/@/components/Icons/DocumentIcon.vue'
import EditIcon from '/@/components/Icons/EditIcon.vue'
import DeleteIcon from '/@/components/Icons/DeleteIcon.vue'

withDefaults(defineProps<{
  withoutDelete?: boolean,
  withoutWordBreak?: boolean,
  withJson?: boolean,
}>(), {
  withoutDelete: false,
  withoutWordBreak: false,
  withJson: false,
})

const emit = defineEmits<{
  (e: 'edit'): void,
  (e: 'delete'): void,
  (e: 'copy'): void,
  (e: 'toggleJson'): void,
  (e: 'toggleWordBreak'): void,
}>()
</script>

<style scoped>

</style>
