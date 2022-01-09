<template>
  <ConfirmDialog :show="show" @update:show="emit('update:show', $event)" @confirm="deleteItem" danger>
    Are you sure you want to delete <b>{{ itemName }}</b> item from {{ name }}?
  </ConfirmDialog>
</template>

<script setup lang="ts">
import ConfirmDialog from '/@/components/Elements/ConfirmDialog.vue'
import { useKeysStore } from '/@/store/keys'
import { computed } from 'vue'

const props = defineProps<{
  show: boolean;
  item: { label: string } | string;
  name: string;
  using: 'deleteListItem' | 'deleteSetItem' | 'deleteZsetItem' | 'deleteHashItem';
}>()

const emit = defineEmits<{
  (e: 'update:show', show: boolean): void
  (e: 'deleted'): void
}>()

const itemName = computed(() => (typeof props.item === 'object' ? props.item.label : props.item).substr(0, 50))

const keysStore = useKeysStore()
const deleteItem = async () => {
  await keysStore[props.using](props.name, props.item)
  emit('deleted')
  keysStore.loadKeys()
  emit('update:show', false)
}
</script>

<style scoped>

</style>
