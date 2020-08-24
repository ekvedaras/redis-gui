<template>
  <ul>
    <li v-for="(key, name) in keys" :key="name">
      <Key v-if="isNamespace(key)" :name="name" :redis-key="key"/>
      <Namespace v-else :namespace="name" :keys="key"/>
    </li>
  </ul>
</template>

<script>
import Key from '@/components/KeyList/Key'
import Namespace from '@/components/KeyList/Namespace'

export default {
  name: 'Keys',
  components: { Namespace, Key },
  props: ['keys'],
  methods: {
    isNamespace (key) {
      return Object.prototype.hasOwnProperty.call(key, 'name') && typeof key.name === 'string'
    },
  },
}
</script>

<style scoped>

</style>
