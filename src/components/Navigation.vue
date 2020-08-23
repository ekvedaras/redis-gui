<template>
  <div class="w-full flex justify-between space-x-2 mb-5 p-2">
    <div>Redis GUI</div>
    <DatabaseSelect/>
  </div>
</template>

<script>
import DatabaseSelect from '@/components/DatabaseSelect'
export default {
  name: 'Navigation',
  components: { DatabaseSelect },
}
</script>

<style scoped>

</style>
