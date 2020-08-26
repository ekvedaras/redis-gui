<template>
  <div class="p-4">
    <ValueRenderer :value="value"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'

export default {
  name: 'StringContent',
  components: { ValueRenderer },
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
