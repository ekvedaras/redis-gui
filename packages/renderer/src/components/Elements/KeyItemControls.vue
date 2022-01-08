<template>
  <div class="absolute h-6 p-0 top-0 right-0 rounded bg-white-80p dark:bg-black-10p dark:group-hover:bg-black-50p text-gray-400 group-hover:text-gray-900 dark:text-gray-700 dark:group-hover:text-gray-500 ">
    <IconButton v-if="!withoutWordBreak" @click="emit('toggleWordBreak')" class="z-10">
      <WordBreakIcon class="w-4 m-1" />
    </IconButton>
    <IconButton v-if="withJson" @click="emit('toggleJson')">
      <CodeIcon class="w-5" />
    </IconButton>
    <IconButton @click="emit('copy')" class="z-10">
      <DocumentIcon class="w-4 m-1" />
    </IconButton>
    <IconButton @click="emit('edit')" class="z-10">
      <EditIcon class="w-4 m-1" />
    </IconButton>
    <IconButton v-if="!withoutDelete" @click="emit('delete')" class="z-10">
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

const props = withDefaults(defineProps<{
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
