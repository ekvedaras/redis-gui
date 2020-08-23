<template>
  <div class="w-full h-full flex justify-between space-x-2 p-2">
    <img src="@/assets/redis.svg" alt="Redis logo" class="h-full"/>
    <h1 class="text-left flex-1">Redis GUI</h1>
    <DatabaseSelect/>
  </div>
</template>

<script>
import DatabaseSelect from '@/components/DatabaseSelect'
export default {
  components: { DatabaseSelect },
}
</script>

<style scoped>

</style>
