<template>
  <div :style="style" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  level: number,
}>()

const style = computed(() => ({
  minWidth: `${ props.level * 20 }px`,
}))
</script>

<style scoped>

</style>
