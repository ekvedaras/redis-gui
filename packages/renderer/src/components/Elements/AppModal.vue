<script setup lang="ts">
withDefaults(defineProps<{
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
</script>

<template>
  <Modal :model-value="show" :close="() => emit('close')" @update:model-value="() => emit('close')">
    <div
      class="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded p-4 flex flex-col space-y-4 overflow-y-auto"
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
  </Modal>
</template>
