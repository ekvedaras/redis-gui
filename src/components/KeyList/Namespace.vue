<template>
  <div>
    <div @click="expanded = !expanded">{{ namespace }}</div>
    <Keys v-if="expanded" :keys="keys"/>
  </div>
</template>

<script>
export default {
  name: 'Namespace',
  props: ['namespace', 'keys'],
  data: () => ({
    expanded: false,
  })
}
</script>

<style scoped>

</style>
