<template>
  <div>
    <SearchBar v-model="search"
               :show-spinner="isLoading"
               with-add :add-name="name" add-type="set" />
    <div class="overflow-y-auto h-full rounded overflow-x-hidden mt-4">
      <Value v-for="(item, i) in value"
             class="relative"
             :key="i" :value="item"
             @save="save(i, $event)"
             @delete="deleteItem(item)" />
      <LoadMoreButton @click="loadMore" v-if="nextCursor" />
      <CenteredLoader v-if="isLoading && !hasItems" />
    </div>
    <ConfirmDeleteDialog v-model:show="showDeleteDialog"
                         :item="itemToDelete"
                         :name="name"
                         using="deleteSetItem" />
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
import { StringArray } from '../../../../types/models'
import ConfirmDeleteDialog from '/@/components/Elements/ConfirmDeleteDialog.vue'

const props = defineProps<{
  name: string,
}>()

const value = ref<StringArray>({})

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
} = useCursorScanner(props.name, 'sscan', (newValue, shouldMerge) => {
  newValue = newValue as StringArray
  value.value = shouldMerge ? {...value.value, ...newValue} : newValue
})

const save = async (key: string, newValue: string) => {
  let commands = []
  commands.push(['srem', props.name, value.value[key]])
  commands.push(['sadd', props.name, key, newValue])

  try {
    await redis.client.multi(commands).exec()
    value.value[key] = newValue
    toaster.success('Saved')
    keysStore.loadKeys()
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

<style scoped>

</style>
