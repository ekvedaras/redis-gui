<template>
  <Modal v-model="value" :close="close">
    <slot />
    <div class="flex justify-end space-x-2">
      <PrimaryButton @click="emit('confirm')">{{ confirmText }}</PrimaryButton>
      <Button @click="close">{{ cancelText }}</Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Button from '/@/components/Elements/Button.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'

const props = withDefaults(defineProps<{
  value: boolean;
  confirmText?: string;
  cancelText?: string;
}>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})

const emit = defineEmits<{
  (e: 'input', value: boolean): void;
  (e: 'confirm'): void;
}>()

const close = () => emit('input', false)
</script>

<style scoped>

</style>
