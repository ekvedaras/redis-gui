<script setup lang="ts">
import Button from '/@/components/Elements/Button.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'
import DangerButton from '/@/components/Elements/DangerButton.vue'
import AppModal from '/@/components/Elements/AppModal.vue'

withDefaults(defineProps<{
  show?: boolean;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}>(), {
  show: true,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  danger: false,
})

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>()

</script>

<template>
  <AppModal :show="show" @close="emit('close')">
    <div class="mt-2">
      <slot />
    </div>
    <div class="flex justify-end space-x-2 mt-6">
      <Button @click="emit('close')">
        {{ cancelText }}
      </Button>
      <DangerButton v-if="danger" @click="emit('confirm')">
        {{ confirmText }}
      </DangerButton>
      <PrimaryButton v-else @click="emit('confirm')">
        {{ confirmText }}
      </PrimaryButton>
    </div>
  </AppModal>
</template>
