<template>
  <div class="bg-gray-200 p-4 flex flex-col space-y-4">
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
