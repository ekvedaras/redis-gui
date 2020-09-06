<template>
  <ul>
    <li v-for="(key, name) in keys" :key="name">
      <Key v-if="isKey(key)" :name="name.replace(/_/, '')" :redis-key="key" :level="level"/>
      <Namespace v-else :namespace="name" :keys="key" :level="level"/>
    </li>
  </ul>
</template>

<script>
import Key from '@/components/KeyList/Key'
import Namespace from '@/components/KeyList/Namespace'

export default {
  name: 'Keys',
  components: { Namespace, Key },
  props: ['keys', 'level'],
  methods: {
    isKey (key) {
      return Object.prototype.hasOwnProperty.call(key, 'name') && typeof key.name === 'string'
    },
  },
}
</script>

<style scoped>

</style>
