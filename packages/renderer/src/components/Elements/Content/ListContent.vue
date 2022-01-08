<template>
  <div>
    <SearchBar v-model="search"
               :show-spinner="isLoading"
               with-add :add-name="name" add-type="list" />
    <div class="overflow-y-auto h-full rounded overflow-x-hidden mt-4">
      <Value v-for="(item, i) in filtered"
             class="relative"
             :key="i" :value="item"
             @save="save(i, $event.value)"
             @delete="deleteItem({label: item, index: i}, 'keys/deleteListItem')" />
      <LoadMoreButton @click="loadMore" v-if="pointer" />
      <CenteredLoader v-if="isLoading && !hasItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import { useKeysStore } from '/@/store/keys'
import { useDeletesItems } from '/@/use/deletesItems'
import { useHasItems } from '/@/use/hasItems'
import { useReloadOnKeyUpdate } from '/@/use/reloadOnKeyUpdate'
import SearchBar from '/@/components/Elements/SearchBar.vue'
import Value from '/@/components/Elements/Value.vue'
import LoadMoreButton from '/@/components/Elements/LoadMoreButton.vue'
import CenteredLoader from '/@/components/Elements/CenteredLoader.vue'
import { usePointerScanner } from '/@/use/pointerScanner'
import { useRegexFilter } from '/@/use/regexFilter'

const props = defineProps<{
  name: string,
}>()

const value = ref<string[]>([])

const redis = useRedis()
const toaster = useToaster()
const keysStore = useKeysStore()
const deleteItem = useDeletesItems(() => resetCursor())
const hasItems = useHasItems(value)
useReloadOnKeyUpdate(props.name, () => resetCursor())

const {search, filtered} = useRegexFilter(value)

const {
  isLoading,
  pointer,
  size,
  loadKeys,
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
</script>

<style scoped>

</style>
