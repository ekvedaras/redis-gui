<template>
  <div class="bg-gray-200 p-4 flex flex-col space-y-4 overflow-y-auto max-h-screen">
    <h2 class="text-xl font-semibold tracking-wider">{{ title }}</h2>
    <slot/>
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
