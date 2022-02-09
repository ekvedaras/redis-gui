<template>
  <table class="w-full">
    <tbody>
      <tr v-for="(value, key) in info" :key="key">
        <th class="text-right whitespace-no-wrap">
          {{ readable(key) }}
        </th>
        <td class="text-left break-all w-full">
          {{ value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{
  info: Record<string, string>;
}>()

const readable = (key: string) => key.substr(0, 1).toUpperCase() + key.substr(1).replace(/_/g, ' ')
</script>

<style scoped>

</style>
