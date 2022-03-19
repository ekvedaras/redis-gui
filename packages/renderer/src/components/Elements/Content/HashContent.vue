<script setup lang="ts">
import { useCursorScanner } from '/@/use/cursorScanner'
import { ref } from 'vue'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import SearchBar from '/@/components/Elements/SearchBar.vue'
import Value from '/@/components/Elements/Value.vue'
import { useHasItems } from '/@/use/hasItems'
import CenteredLoader from '/@/components/Elements/CenteredLoader.vue'
import LoadMoreButton from '/@/components/Elements/LoadMoreButton.vue'
import ConfirmDeleteDialog from '/@/components/Elements/ConfirmDeleteDialog.vue'
import type { Tuple } from 'types/models'
import { useReloadOnKeyUpdate } from '/@/use/reloadOnKeyUpdate'

const props = defineProps<{
  name: string,
}>()

const value = ref<Tuple[]>([])

const redis = useRedis()
const toaster = useToaster()
const hasItems = useHasItems(value)
const {
  search,
  isLoading,
  nextCursor,
  loadKeys,
  loadMore,
} = useCursorScanner(props.name, 'hScan', (newValue, shouldMerge) => {
  value.value = shouldMerge ? {...value.value, ...(newValue as Tuple[])} : (newValue as Tuple[])
})

useReloadOnKeyUpdate(props.name, () => loadKeys())

const save = async (key: string, newKey: string | number, value: string) => {
  let commands = []
  if (key !== newKey) {
    commands.push({args: ['hdel', props.name, key]})
  }

  commands.push({args: ['hset', props.name, newKey, value]})

  try {
    await redis.client.multiExecutor(commands)
    toaster.success('Saved')
    await loadKeys()
  } catch (error) {
    toaster.error(String(error))
  }
}

const showDeleteDialog = ref(false)
const itemToDelete = ref<string>('')
const deleteItem = (item: string) => {
  itemToDelete.value = item
  showDeleteDialog.value = true
}
</script>

<template>
  <div>
    <SearchBar
      v-model:value="search"
      :show-spinner="isLoading"
      with-add :add-name="name" add-type="hash"
    />
    <div class="overflow-y-auto h-full rounded mt-4">
      <Value
        v-for="tuple in value"
        :key="tuple.field"
        class="relative" :value="tuple.value" :item-key="tuple.field"
        @save="save(tuple.field, $event.key, $event.value)"
        @delete="deleteItem(tuple.field)"
      />
      <LoadMoreButton v-if="nextCursor" @click="loadMore" />
      <CenteredLoader v-if="isLoading && !hasItems" />
    </div>
    <ConfirmDeleteDialog
      v-if="showDeleteDialog" :item="itemToDelete"
      :name="name"
      using="deleteHashItem"
      @close="showDeleteDialog = false"
      @deleted="loadKeys"
    />
  </div>
</template>
