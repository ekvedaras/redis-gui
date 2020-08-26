<template>
  <div class="p-4">
    <ValueRenderer v-for="(item, i) in value" :key="i" :value="item"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'

export default {
  name: 'ListContent',
  components: { ValueRenderer },
  props: ['name'],
  data: () => ({
    value: []
  }),
  async mounted () {
    this.value = await redis.async('lrange', this.name, 0, 100)
  }
}
</script>

<style scoped>

</style>
