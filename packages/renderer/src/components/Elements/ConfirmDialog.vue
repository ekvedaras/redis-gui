<template>
  <AppModal :show="show" @update:show="emit('update:show', $event)">
    <div class="mt-2">
      <slot />
    </div>
    <div class="flex justify-end space-x-2 mt-6">
      <Button @click="close">{{ cancelText }}</Button>
      <DangerButton v-if="danger" @click="emit('confirm')">{{ confirmText }}</DangerButton>
      <PrimaryButton v-else @click="emit('confirm')">{{ confirmText }}</PrimaryButton>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import Button from '/@/components/Elements/Button.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'
import DangerButton from '/@/components/Elements/DangerButton.vue'
import AppModal from '/@/components/Elements/AppModal.vue'

const props = withDefaults(defineProps<{
  show: boolean;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  danger: false,
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
  (e: 'confirm'): void;
}>()

const close = () => emit('update:show', false)
</script>

<style scoped>

</style>
