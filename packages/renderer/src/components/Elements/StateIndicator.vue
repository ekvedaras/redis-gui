<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  state: string
}>()

const stateClass = computed(() => {
  switch (props.state.toLowerCase()) {
    case 'ok':
      return 'green'
    case 'pending':
      return 'orange'
    default:
      return 'red'
  }
})
</script>

<template>
  <div
    class="rounded-full w-3 h-3 shadow"
    :class="stateClass"
  />
</template>

<style scoped>
div.green {
  @apply bg-emerald-500
}

div.orange {
  @apply bg-yellow-500
}

div.red {
  @apply bg-red-600
}
</style>
