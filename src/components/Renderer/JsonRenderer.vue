<template>
  <vue-json-pretty
      class="bg-gray-100 font-mono overflow-x-auto rounded shadow-md p-4"
      :data="data"
      :deep="4"
      highlight-mouseover-node
      show-length
  />
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'

export default {
  name: 'JsonRenderer',
  components: { VueJsonPretty },
  props: ['data'],
}
</script>

<style scoped>

</style>
