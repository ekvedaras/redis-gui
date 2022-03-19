<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void;
}>()
</script>

<template>
  <button
    :class="[
      'rounded text-gray-500',
      'hover:bg-red-200 focus:bg-red-200 hover:text-redis',
      'dark:hover:bg-redis-700 dark:focus:bg-redis-700 dark:hover:text-redis-300',
      'focus:text-redis',
    ]"
    type="button"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>
