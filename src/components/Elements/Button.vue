<template>
  <button @click="$emit('click')" type="button" class="hover:bg-red-200 focus:bg-red-200 text-gray-500 hover:text-redis focus:text-redis rounded">
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'Button',
}
</script>

<style scoped>

</style>
