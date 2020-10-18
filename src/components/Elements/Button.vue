<template>
  <button @click="$emit('click')"
          :type="type"
          class="btn transition transition-colors duration-100 ease-in-out p-2 rounded shadow-none hover:shadow-md">
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'button',
    },
  },
}
</script>

<style>
  button {
    @apply text-gray-500
  }

  button:hover {
    @apply text-gray-900
  }
</style>
