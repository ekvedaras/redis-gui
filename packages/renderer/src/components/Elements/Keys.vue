<template>
  <ul>
    <li
      v-for="(key, name) in keys"
      :key="name"
    >
      <Key
        v-if="isKey(key)"
        :name="name.replace(/_/, '')"
        :redis-key="key"
        :level="level"
      />
      <Namespace
        v-else
        :namespace="name"
        :keys="key"
        :level="level"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Key as KeyType, Keys } from '../../../types/redis'
import Key from '/@/components/Elements/Key.vue'
import Namespace from '/@/components/Elements/Namespace.vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps<{
  keys: Keys,
  level: number,
}>()

const isKey = (key: KeyType) => {
  return Object.prototype.hasOwnProperty.call(key, 'name')
}
</script>

<style scoped>

</style>
