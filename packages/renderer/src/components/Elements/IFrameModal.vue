<template>
  <Modal v-model="show" :close="close">
    <div class="bg-white dark:bg-gray-700 dark:text-white rounded shadow-lg p-4 w-2/3">
      <h2 class="text-lg font-semibold mt-2">{{ title }}</h2>
      <iframe :src="url" :style="{height: '80vh'}" class="shadow rounded mt-4 w-full" ref="iframe" />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  show: boolean;
  url: string;
  title: string;
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>()

const close = () => emit('update:show', false)

const iframe = ref<HTMLIFrameElement>()

// Otherwise, ESC won't close the modal while iframe is focused. Helps for quick close after miss-click
onMounted(() => setTimeout(() => iframe.value?.blur(), 500))
</script>

<style scoped>

</style>
