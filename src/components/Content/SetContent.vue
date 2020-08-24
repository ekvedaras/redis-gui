<template>
  <div class="p-4">
    <div class="bg-gray-900 text-white font-mono overflow-x-auto rounded shadow-md p-4">{{ value }}</div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'

export default {
  name: 'SetContent',
  props: ['name'],
  data: () => ({
    value: ''
  }),
  async mounted () {
    this.value = await redis.async('smembers', this.name)
  }
}
</script>

<style scoped>

</style>
