<script setup lang="ts">
import prettyBytes from 'pretty-bytes'

defineProps<{
  length: number;
}>()
</script>

<template>
  <span class="rounded px-2 py-1 bg-white-80p dark:bg-black-10p dark:group-hover:bg-black-50p text-gray-400 group-hover:text-gray-900 dark:text-gray-700 dark:group-hover:text-gray-500 text-sm">
    {{ prettyBytes(length) }}
  </span>
</template>
