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
    class="shadow hover:bg-redis focus:bg-redis bg-blue-500 text-white hover:text-white focus:text-white hover:no-underline focus:no-underline"
    @click="emit('click')"
  >
    <slot />
  </Button>
</template>
