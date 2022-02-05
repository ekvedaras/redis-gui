<template>
  <Modal show :close="() => emit('close')">
    <div
      class="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded p-4 flex flex-col space-y-4 overflow-y-auto"
      :class="{'h-screen' : fullHeight, 'w-4/5' : fullWidth}"
      :style="{maxHeight: '92vh'}"
    >
      <h2
        v-if="title"
        class="text-xl font-semibold tracking-wider text-gray-800 dark:text-gray-200"
      >
        {{ title }}
      </h2>
      <div class="flex-1 flex flex-col space-y-4 h-full">
        <slot />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string;
  fullWidth?: boolean;
  fullHeight?: boolean;
}>(), {
  title: undefined,
  fullWidth: false,
  fullHeight: false,
})

const emit = defineEmits<{
  (e: 'close'): void;
}>()
</script>

<style scoped>

</style>
