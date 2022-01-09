<template>
  <div>
    <SearchBar v-model:value="search"
               :show-spinner="isLoading"
               with-add :add-name="name" add-type="zset" />
    <div class="overflow-y-auto h-full rounded mt-4">
      <Value v-for="item in value"
             class="relative"
             :key="item.value" :value="item.value" :item-key="String(item.score)"
             @save="save"
             @delete="deleteItem(item.value)" />
      <LoadMoreButton @click="loadMore" v-if="nextCursor" />
      <CenteredLoader v-if="isLoading && !hasItems" />
    </div>
    <ConfirmDeleteDialog v-model:show="showDeleteDialog"
                         :item="itemToDelete"
                         :name="name"
                         using="deleteZsetItem" />
  </div>
</template>

<script setup lang="ts">
import { useCursorScanner } from '/@/use/cursorScanner'
import { ref } from 'vue'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import { useKeysStore } from '/@/store/keys'
import SearchBar from '/@/components/Elements/SearchBar.vue'
import Value from '/@/components/Elements/Value.vue'
import { useHasItems } from '/@/use/hasItems'
import CenteredLoader from '/@/components/Elements/CenteredLoader.vue'
import LoadMoreButton from '/@/components/Elements/LoadMoreButton.vue'
import ConfirmDeleteDialog from '/@/components/Elements/ConfirmDeleteDialog.vue'
import { ZMember } from '../../../../types/models'

const props = defineProps<{
  name: string,
}>()

const value = ref<ZMember[]>([])

const redis = useRedis()
const toaster = useToaster()
const keysStore = useKeysStore()
const hasItems = useHasItems(value)
const {
  search,
  isLoading,
  nextCursor,
  loadKeys,
  loadMore,
} = useCursorScanner(props.name, 'zScan', (newValue, shouldMerge) => {
  value.value = shouldMerge ? [...value.value, ...(newValue as ZMember[])] : (newValue as ZMember[])
})

const save = async (score: number, newValue: string) => {
  try {
    await redis.client.zAdd(props.name, {score, value: newValue})
    toaster.success('Saved')
    await loadKeys()
  } catch (error) {
    toaster.error(error)
  }
}

const showDeleteDialog = ref(false)
const itemToDelete = ref<string>('')
const deleteItem = (item: string) => {
  itemToDelete.value = item
  showDeleteDialog.value = true
}
</script>

<style scoped>

</style>
