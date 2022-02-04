<template>
  <AppModal
    :show="show"
    :title="title"
    full-height
    full-width
    @update:show="emit('update:show', $event)"
  >
    <iframe
      ref="iframe"
      :src="url"
      :style="{height: '80vh'}"
      class="shadow rounded mt-4 w-full"
    />
  </AppModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppModal from '/@/components/Elements/AppModal.vue'

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
