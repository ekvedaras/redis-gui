<template>
  <div class="p-4">
    <pre class="bg-gray-900 text-white">{{ value }}</pre>
  </div>
</template>

<script>
import { redis } from '@/services/redis'

export default {
  name: 'ListContent',
  props: ['name'],
  data: () => ({
    value: ''
  }),
  async mounted () {
    this.value = await redis.async('lrange', this.name, 0, 100)
  }
}
</script>

<style scoped>

</style>
