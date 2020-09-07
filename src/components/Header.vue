<template>
  <div class="w-full h-full flex justify-between items-center space-x-2 px-2">
    <img src="@/assets/redis.svg" alt="Redis logo" class="h-full"/>
    <h1 class="text-left text-xl font-semibold tracking-widest">Redis GUI</h1>
    <div class="flex-1 text-center">
      <ServerSelect class="flex-1 bg-gray-300 rounded p-1"/>
    </div>
    <DatabaseSelect class="bg-gray-300 rounded p-1"/>
  </div>
</template>

<script>
import DatabaseSelect from '@/components/DatabaseSelect'
import ServerSelect from '@/components/ServerSelect'

export default {
  components: { ServerSelect, DatabaseSelect },
}
</script>

<style scoped>

</style>
