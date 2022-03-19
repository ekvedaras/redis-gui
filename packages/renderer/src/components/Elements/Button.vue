<script setup lang="ts">
export type ButtonType = 'button' | 'submit' | 'reset'

withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset',
  disabled?: boolean,
}>(), {
  type: 'button',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'click'): void;
}>()
</script>

<template>
  <button
    :type="type"
    class="btn transition transition-colors duration-100 ease-in-out p-2 rounded shadow-none hover:underline focus:underline"
    :class="{'opacity-50' : disabled}"
    :disabled="disabled"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<style>
button {
  @apply text-gray-500
}

button:hover, button:focus {
  @apply text-gray-900
}

@media (prefers-color-scheme: dark) {
  button:hover, button:focus {
    @apply text-gray-300
  }
}
</style>
