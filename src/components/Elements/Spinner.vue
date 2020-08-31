<template>
  <svg class="animate-spin w-5 h-5 transition-opacity duration-300 absolute right-0 mr-3 text-gray-800" fill="none" viewBox="0 0 50 50">
    <circle class="stroke-current" :style="{strokeDasharray: 283,strokeDashoffset: 190, strokeLinecap: 'round'}" cx="25" cy="25" r="20" stroke-width="5"/>
  </svg>
</template>

<script>
export default {
  name: 'Spinner',
}
</script>

<style scoped>

</style>
