<template>
  <Button @click="emit('click')"
          :type="type"
          class="shadow hover:bg-redis focus:bg-redis bg-red-700 text-white hover:text-white focus:text-white hover:no-underline focus:no-underline">
    <slot />
  </Button>
</template>

<script setup lang="ts">
import Button from '/@/components/Elements/Button.vue'

const props = withDefaults(defineProps<{
  type?: string
}>(), {
  type: 'button',
})

const emit = defineEmits<{
  (e: 'click'): void,
}>()
</script>

<style scoped>

</style>
