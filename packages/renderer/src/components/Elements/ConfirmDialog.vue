<template>
  <Modal v-model="value" :close="close">
    <div class="bg-white dark:bg-gray-700 dark:text-white rounded shadow-lg p-4">
      <div class="mt-2">
        <slot />
      </div>
      <div class="flex justify-end space-x-2 mt-6">
        <Button @click="close">{{ cancelText }}</Button>
        <DangerButton v-if="danger" @click="confirm">{{ confirmText }}</DangerButton>
        <PrimaryButton v-else @click="emit('confirm')">{{ confirmText }}</PrimaryButton>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Button from '/@/components/Elements/Button.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'
import DangerButton from '/@/components/Elements/DangerButton.vue'

const props = withDefaults(defineProps<{
  value: boolean;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  danger: false,
})

const emit = defineEmits<{
  (e: 'update:value', value: boolean): void;
  (e: 'confirm'): void;
}>()

const close = () => emit('update:value', false)
</script>

<style scoped>

</style>
