<template>
  <div>
    <template v-if="!currentKey.name">
      <span class="text-xl2 font-light">Select key</span>
    </template>
    <template v-else>
      <h2 class="text-xl">{{ currentKey.name }}</h2>
      <pre>{{ currentKey.value }}</pre>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'KeyContent',
  computed: mapState(['currentKey'])
}
</script>

<style scoped>

</style>
