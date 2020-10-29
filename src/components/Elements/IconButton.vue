<template>
  <button @click="$emit('click')"
          type="button"
          :class="[
              'rounded text-gray-500',
              'hover:bg-red-200 focus:bg-red-200 hover:text-redis',
              'dark:hover:bg-redis-700 dark:focus:bg-redis-700 dark:hover:text-redis-300',
              'focus:text-redis',
              ]">
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'IconButton',
}
</script>

<style scoped>

</style>
