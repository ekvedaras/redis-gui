<template>
  <Modal v-model="show" :close="() => emit('update:show', false)">
    <div class="bg-gray-200 dark:bg-gray-800 rounded p-4 flex flex-col space-y-4 overflow-y-auto" :style="{maxHeight: '90vh'}">
      <h2 v-if="title" class="text-xl font-semibold tracking-wider">{{ title }}</h2>
      <div class="flex-1 flex flex-col space-y-4">
        <slot />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
  title?: string;
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>()
</script>

<style scoped>

</style>
