<script setup lang="ts">
import IconButton from '/@/components/Elements/IconButton.vue'

const emit = defineEmits<{
  (e: 'click'): void;
}>()
</script>

<template>
  <IconButton
    class="underline rounded-sm transition duration-200 ease-in-out hover:bg-white hover:shadow-sm hover:no-underline m-2 p-1"
    @click="emit('click')"
  >
    Load more...
  </IconButton>
</template>
