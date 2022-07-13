<script setup lang="ts">
import type { Key as KeyType } from '../../../types/redis'
import Key from '/@/components/Elements/Key.vue'
import type { DefineComponent } from 'vue'
import { defineAsyncComponent } from 'vue'
import type { NamespaceProps } from '/@/components/Elements/Namespace.vue'

// We need to load Namespace component asynchronously because otherwise,
// vue-tsc gets confused due to circular dependency.
const Namespace = defineAsyncComponent<DefineComponent<NamespaceProps>>(
  () => import('/@/components/Elements/Namespace.vue') as never,
)

defineProps<{
  keys: Record<string, KeyType> | Record<string, Record<string, KeyType>>,
  level: number,
}>()

const isKey = (key: KeyType | Record<string, KeyType>) => Object.prototype.hasOwnProperty.call(key, 'name')

const asKey = (key: KeyType | Record<string, KeyType>) => (key as KeyType)
const asKeys = (key: KeyType | Record<string, KeyType>) => (key as Record<string, KeyType>)
</script>

<template>
  <ul>
    <li
      v-for="(key, name) in keys"
      :key="name"
      class="flex items-center"
    >
      <Key
        v-if="isKey(key)"
        :name="name.replace(/_/, '')"
        :redis-key="asKey(key)"
        :level="level"
      />
      <Namespace
        v-else
        :namespace="name"
        :keys="asKeys(key)"
        :level="level"
      />
    </li>
  </ul>
</template>
