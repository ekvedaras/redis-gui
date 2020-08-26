<template>
  <div class="p-4">
    <ValueRenderer v-for="(item, i) in value" :key="i" :value="item"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'

export default {
  name: 'SetContent',
  components: { ValueRenderer },
  props: ['name'],
  data: () => ({
    value: []
  }),
  async mounted () {
    this.value = await redis.async('smembers', this.name)
  }
}
</script>

<style scoped>

</style>
