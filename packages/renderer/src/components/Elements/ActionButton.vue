<script setup lang="ts">
import type { ButtonType } from '/@/components/Elements/Button.vue'
import Button from '/@/components/Elements/Button.vue'

withDefaults(defineProps<{
  type?: ButtonType
}>(), {
  type: 'button',
})

const emit = defineEmits<{
  (e: 'click'): void,
}>()
</script>

<template>
  <Button
    :type="type"
    class="py-1 text-xs shadow-sm hover:shadow bg-gray-200 focus:bg-blue-400 text-gray-600 hover:text-gray-900 focus:text-white hover:no-underline focus:no-underline"
    @click="emit('click')"
  >
    <slot />
  </Button>
</template>
