<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppModal from '/@/components/Elements/AppModal.vue'

defineProps<{
  url: string;
  title: string;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const iframe = ref<HTMLIFrameElement>()

// Otherwise, ESC won't close the modal while iframe is focused. Helps for quick close after miss-click
onMounted(() => setTimeout(() => iframe.value?.blur(), 500))
</script>

<template>
  <AppModal :title="title" full-height full-width @close="emit('close')">
    <iframe
      ref="iframe"
      :src="url"
      :style="{height: '80vh'}"
      class="shadow rounded mt-4 w-full"
    />
  </AppModal>
</template>
