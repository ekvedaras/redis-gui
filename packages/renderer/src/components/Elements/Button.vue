<template>
  <button @click="emit('click')"
          :type="type"
          class="btn transition transition-colors duration-100 ease-in-out p-2 rounded shadow-none hover:underline focus:underline">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: string
}>(), {
  type: 'button',
})

const emit = defineEmits<{
  (e: 'click'): void;
}>()
</script>

<style>
button {
  @apply text-gray-500
}

button:hover, button:focus {
  @apply text-gray-900
}

@screen dark {
  button:hover, button:focus {
    @apply text-gray-300
  }
}
</style>
