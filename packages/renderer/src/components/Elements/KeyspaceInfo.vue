<template>
  <table class="w-full">
    <thead>
    <tr>
      <th>Name</th>
      <th>Keys</th>
      <th>Expires</th>
      <th>Average TTL</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(database, id) in databases" :key="database.id">
      <th>{{ id }}</th>
      <td>{{ database.keys }}</td>
      <td>{{ database.expires }}</td>
      <td>{{ database.avg_ttl }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  info: Record<string, string>
}>()

const databases = computed(() => {
  let result: Record<string, Record<string, string>> = {}, propKey, value

  Object.keys(props.info).forEach(key => {
    result[key] = {}
    props.info[key].split(',').forEach(prop => {
      [propKey, value] = prop.split('=')
      result[key][propKey] = value
    })
  })

  return result
})
</script>

<style scoped>

</style>
