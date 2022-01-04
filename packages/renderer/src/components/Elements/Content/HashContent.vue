<template>
  <div>
    <SearchBar v-model="search"
               :show-spinner="isLoading"
               with-add :add-name="name" add-type="hash" />
    <div class="overflow-y-auto h-full rounded mt-4">
      <Value v-for="(item, key) in value"
             class="relative"
             :key="key" :value="item" :item-key="String(key)"
             @save="save(key, $event.key, $event.value)"
             @delete="deleteItem(key, 'keys/deleteHashItem')" />
      <LoadMoreButton @click="loadMore" v-if="nextCursor" />
      <CenteredLoader v-if="isLoading && !hasItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCursorScanner } from '/@/use/cursorScanner'
import { chunk, fromPairs } from 'lodash'
import { ref } from 'vue'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import { useKeysStore } from '/@/store/keys'
import SearchBar from '/@/components/Elements/SearchBar.vue'
import Value from '/@/components/Elements/Value.vue'
import { useDeletesItems } from '/@/use/deletesItems'
import { useHasItems } from '/@/use/hasItems'
import CenteredLoader from '/@/components/Elements/CenteredLoader.vue'
import LoadMoreButton from '/@/components/Elements/LoadMoreButton.vue'

const props = defineProps<{
  name: string,
}>()

const value = ref({})

const redis = useRedis()
const toaster = useToaster()
const keysStore = useKeysStore()
const deleteItem = useDeletesItems()
const hasItems = useHasItems(value)
const {
  search,
  isLoading,
  nextCursor,
  loadKeys,
  loadMore,
} = useCursorScanner(props.name, 'hscan', (newValue, shouldMerge) => {
  let parsed = fromPairs(chunk((newValue as string[]), 2))
  value.value = shouldMerge ? {...value.value, ...parsed} : parsed
})

const save = async (key: string, newKey: string, value: string) => {
  let commands = []
  if (key !== newKey) {
    commands.push(['hdel', props.name, key])
  }

  commands.push(['hset', props.name, newKey, value])

  try {
    await redis.client.multi(commands).exec()
    toaster.success('Saved')
    keysStore.loadKeys()
  } catch (error) {
    toaster.error(error)
  }
}
</script>

<style scoped>

</style>
