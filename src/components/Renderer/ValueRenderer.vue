<template>
  <div>
    <JsonRenderer v-if="isJSON(value)" :data="JSON.parse(value)"/>
    <PlainRenderer v-else>{{ value }}</PlainRenderer>
  </div>
</template>

<script>
import { isJSON } from '@/services/json'
import JsonRenderer from '@/components/Renderer/JsonRenderer'
import PlainRenderer from '@/components/Renderer/PlainRenderer'
export default {
  name: 'ValueRenderer',
  components: { PlainRenderer, JsonRenderer },
  props: ['value'],
  methods: { isJSON },
}
</script>

<style scoped>

</style>
