<template>
  <span class="rounded px-2 py-1 bg-white-80p dark:bg-black-10p dark:group-hover:bg-black-50p text-gray-400 group-hover:text-gray-900 dark:text-gray-700 dark:group-hover:text-gray-500 text-sm">
    {{ length | prettyBytes }}
  </span>
</template>

<script>
export default {
  name: 'ValueSize',
  props: {
    length: Number,
  },
}
</script>

<style scoped>

</style>
