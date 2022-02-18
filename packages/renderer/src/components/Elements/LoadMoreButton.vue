<script setup lang="ts">
import IconButton from '/@/components/Elements/IconButton.vue'

const emit = defineEmits<{
  (e: 'click'): void;
}>()
</script>

<template>
  <IconButton
    class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1"
    @click="emit('click')"
  >
    Load more...
  </IconButton>
</template>
