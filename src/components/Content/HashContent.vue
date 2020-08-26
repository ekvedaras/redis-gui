<template>
  <div class="p-4">
    <JsonRenderer :data="value"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import JsonRenderer from '@/components/Renderer/JsonRenderer'

export default {
  name: 'HashContent',
  components: { JsonRenderer },
  props: ['name'],
  data: () => ({
    value: ''
  }),
  async mounted () {
    this.value = await redis.async('hgetall', this.name)
  }
}
</script>

<style scoped>

</style>
