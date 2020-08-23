<template>
  <div class="p-4">
    <pre class="bg-gray-900 text-white">{{ value }}</pre>
  </div>
</template>

<script>
import { redis } from '@/services/redis'

export default {
  name: 'StringContent',
  props: ['name'],
  data: () => ({
    value: ''
  }),
  async mounted () {
    this.value = await redis.async('get', this.name)
  }
}
</script>

<style scoped>

</style>
