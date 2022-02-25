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
import { useReloadOnKeyUpdate } from '/@/use/reloadOnKeyUpdate'

const props = defineProps<{
  name: string,
}>()

const value = ref<string[]>([])

const redis = useRedis()
const toaster = useToaster()
const hasItems = useHasItems(value)

const {
  search,
  isLoading,
  nextCursor,
  loadKeys,
  loadMore,
} = useCursorScanner(props.name, 'sScan', (newValue, shouldMerge) => {
  value.value = shouldMerge ? [...value.value, ...(newValue as string[])] : (newValue as string[])
})

useReloadOnKeyUpdate(props.name, () => loadKeys())

const save = async ({value: newValue, key}: { key: number | string, value: string }) => {
  let commands = []
  commands.push(['srem', props.name, value.value[key as number]])
  commands.push(['sadd', props.name, key, newValue])

  try {
    await redis.client.multi(commands).exec()
    value.value[key as number] = newValue
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

<template>
  <div>
    <SearchBar
      v-model:value="search"
      :show-spinner="isLoading"
      with-add :add-name="name" add-type="set"
    />
    <div class="overflow-y-auto h-full rounded overflow-x-hidden mt-4">
      <Value
        v-for="(item, i) in value"
        :key="i"
        class="relative" :value="item" :item-key="i"
        @save="save($event)"
        @delete="deleteItem(item)"
      />
      <LoadMoreButton v-if="nextCursor" @click="loadMore" />
      <CenteredLoader v-if="isLoading && !hasItems" />
    </div>
    <ConfirmDeleteDialog
      v-if="showDeleteDialog" :item="itemToDelete"
      :name="name"
      using="deleteSetItem"
      @close="showDeleteDialog = false"
    />
  </div>
</template>
