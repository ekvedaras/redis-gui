<script lang="ts">
let documentReady = false
window.addEventListener('DOMContentLoaded', () => documentReady = true, {once: true})
</script>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  show?: boolean;
  title?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
}>(), {
  show: true,
  title: undefined,
  fullWidth: false,
  fullHeight: false,
})

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const dialog = ref<HTMLDialogElement>()

const sync = () => props.show ? dialog.value?.showModal() : dialog.value?.close()

// The titlebar reparents body children on DOMContentLoaded, dropping dialogs opened before that out of the top
// layer. Reopening them from here, in setup order, also keeps nested modals stacked outermost first.
if (documentReady) {
  onMounted(sync)
} else {
  window.addEventListener('DOMContentLoaded', sync, {once: true})
}

watch(() => props.show, sync)
</script>

<template>
  <dialog
    ref="dialog"
    class="app-modal w-screen h-screen max-w-none max-h-none bg-transparent outline-none overflow-hidden open:flex items-center justify-center"
    @cancel.prevent="emit('close')"
    @click.self="emit('close')"
  >
    <div
      class="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-sm p-4 flex flex-col space-y-4 overflow-y-auto"
      :class="{'h-screen' : fullHeight, 'w-4/5' : fullWidth}"
      :style="{maxHeight: '92vh'}"
    >
      <div class="flex">
        <h2
          v-if="title"
          class="flex-1 text-xl font-semibold tracking-wider text-gray-800 dark:text-gray-200"
        >
          {{ title }}
        </h2>
        <slot name="header" />
      </div>

      <div class="flex-1 flex flex-col space-y-4 h-full">
        <slot />
      </div>
    </div>
  </dialog>
</template>

<style>
.app-modal::backdrop {
  background-color: rgba(0, 0, 0, 0.6);
}

@media (prefers-color-scheme: dark) {
  .app-modal::backdrop {
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>
