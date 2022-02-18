<script setup lang="ts">
import ConfirmDialog from '/@/components/Elements/ConfirmDialog.vue'
import { useKeysStore } from '/@/store/keys'
import { computed } from 'vue'

const props = defineProps<{
  item: { label: string } | string;
  name: string;
  using: 'deleteListItem' | 'deleteSetItem' | 'deleteZsetItem' | 'deleteHashItem';
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'deleted'): void
}>()

const itemName = computed(() => (typeof props.item === 'object' ? props.item.label : props.item).substr(0, 50))

const keysStore = useKeysStore()
const deleteItem = async () => {
  await keysStore[props.using](props.name, props.item)
  emit('deleted')
  keysStore.loadKeys()
  emit('close')
}
</script>

<template>
  <ConfirmDialog danger @close="emit('close')" @confirm="deleteItem">
    Are you sure you want to delete <b>{{ itemName }}</b> item from {{ name }}?
  </ConfirmDialog>
</template>
