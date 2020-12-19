<template>
  <div class="bg-gray-200 dark:bg-gray-800 p-4 flex flex-col space-y-4 overflow-y-auto" :style="{maxHeight: '90vh'}">
    <h2 class="text-xl font-semibold tracking-wider">{{ title }}</h2>
    <div class="flex-1 flex flex-col space-y-4">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: ['title'],
}
</script>

<style scoped>

</style>
