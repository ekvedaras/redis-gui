<template>
  <div class="p-4">
    <pre class="bg-gray-900 text-white">{{ value }}</pre>
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
