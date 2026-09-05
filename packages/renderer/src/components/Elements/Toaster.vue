<script setup lang="ts">
import {ref, watch} from 'vue'
import {toasts} from '/@/use/toaster'

const container = ref<HTMLDivElement>()

// Re-promoting the popover keeps toasts above any <dialog> already in the top layer.
watch(() => toasts.value.length, length => {
  container.value?.hidePopover()
  if (length) {
    container.value?.showPopover()
  }
})
</script>

<template>
  <div ref="container" popover="manual" class="toaster flex flex-col items-end space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="px-4 py-2 rounded-sm shadow-lg text-white"
      :class="{
        'bg-jungle-green-600': toast.type === 'success',
        'bg-redis-600': toast.type === 'error',
        'bg-picton-blue-600': toast.type === 'info',
      }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<style>
.toaster {
  position: fixed;
  inset: auto 1rem 1rem auto;
  background: transparent;
}
</style>
