<script setup lang="ts">
import ConfirmDialog from '/@/components/Elements/ConfirmDialog.vue'
import { useKeysStore } from '/@/store/keys'
import { computed } from 'vue'

const props = defineProps<{
  item: string;
  name: string;
  using: 'deleteListItem' | 'deleteSetItem' | 'deleteZsetItem' | 'deleteHashItem';
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'deleted'): void
}>()

const itemName = computed(() => props.item.substring(0, 50))

const keysStore = useKeysStore()
const deleteItem = async () => {
  switch (props.using) {
    case 'deleteHashItem': {
      await keysStore.deleteHashItem(props.name, props.item as string)
      break
    }
    case 'deleteListItem': {
      await keysStore.deleteListItem(props.name, props.item as unknown as number)
      break
    }
    case 'deleteSetItem': {
      await keysStore.deleteSetItem(props.name, props.item as string)
      break
    }
    case 'deleteZsetItem': {
      await keysStore.deleteZsetItem(props.name, props.item as string)
      break
    }
  }
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
