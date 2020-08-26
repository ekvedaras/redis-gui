<template>
  <div class="p-4">
    <PlainRenderer>{{ value }}</PlainRenderer>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import PlainRenderer from '@/components/Renderer/PlainRenderer'

export default {
  name: 'SetContent',
  components: { PlainRenderer },
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
