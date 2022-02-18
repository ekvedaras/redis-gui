<script setup lang="ts">
import { ref } from 'vue'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import { useHasItems } from '/@/use/hasItems'
import { useReloadOnKeyUpdate } from '/@/use/reloadOnKeyUpdate'
import SearchBar from '/@/components/Elements/SearchBar.vue'
import Value from '/@/components/Elements/Value.vue'
import LoadMoreButton from '/@/components/Elements/LoadMoreButton.vue'
import CenteredLoader from '/@/components/Elements/CenteredLoader.vue'
import { usePointerScanner } from '/@/use/pointerScanner'
import { useRegexFilter } from '/@/use/regexFilter'
import ConfirmDeleteDialog from '/@/components/Elements/ConfirmDeleteDialog.vue'

const props = defineProps<{
  name: string,
}>()

const value = ref<string[]>([])

const redis = useRedis()
const toaster = useToaster()
const hasItems = useHasItems(value)
useReloadOnKeyUpdate(props.name, () => resetCursor())

const { search, filtered } = useRegexFilter(value)

const {
  isLoading,
  pointer,
  size,
  loadMore,
} = usePointerScanner(props.name, 'lrange', 'llength', value)

const resetCursor = async () => {
  size.value = await redis.client.lLen(props.name)
  pointer.value = 0
}

const save = async (key: number, newValue: string) => {
  try {
    await redis.client.lSet(props.name, key, newValue)
    value.value[key] = newValue
    toaster.success('Saved')
  } catch (error) {
    toaster.error(error)
  }
}

const showDeleteDialog = ref(false)
const itemToDelete = ref<string | null>(null)
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
      with-add :add-name="name" add-type="list"
    />
    <div class="overflow-y-auto h-full rounded overflow-x-hidden mt-4">
      <Value
        v-for="(item, i) in filtered"
        :key="i"
        class="relative" :value="item"
        @save="save(i, $event.value)"
        @delete="deleteItem(item)"
      />
      <LoadMoreButton v-if="pointer" @click="loadMore" />
      <CenteredLoader v-if="isLoading && !hasItems" />
    </div>
    <ConfirmDeleteDialog
      v-if="showDeleteDialog && itemToDelete"
      :item="itemToDelete"
      :name="name"
      using="deleteListItem"
      @close="showDeleteDialog = false"
      @confirm="resetCursor"
    />
  </div>
</template>
