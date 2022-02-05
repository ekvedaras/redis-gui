<template>
  <AppModal title="Settings" @close="emit('close')">
    <table>
      <tr v-tooltip="'Applies to key list on the left and key items. However, if key contains not too many items, redis might return more then this, since it is more efficient.'">
        <th><label for="items-per-page" class="font-semibold mr-2">Items per page</label></th>
        <td><input id="items-per-page" v-model="itemsPerPage" type="number" step="1" min="1" /></td>
      </tr>
      <tr v-tooltip="'Key containing this symbol will be split into nested folders for easier management.'">
        <th><label for="namespace-separator" class="font-semibold mr-2">Namespace separator</label></th>
        <td><input id="namespace-separator" v-model="namespaceSeparator" type="text" min="1" /></td>
      </tr>
    </table>
    <div class="flex justify-end space-x-4">
      <Button @click="emit('close')">
        Cancel
      </Button>
      <PrimaryButton @click="save">
        Save
      </PrimaryButton>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDatabase } from '/@/use/database'
import AppModal from '/@/components/Elements/AppModal.vue'
import Button from '/@/components/Elements/Button.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import { useKeysStore } from '/@/store/keys'

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const itemsPerPage = ref(0)
const namespaceSeparator = ref('-')
const leftPaneSize = ref('25%')

const database = useDatabase()

onMounted(() => {
  let settings = database.data.settings
  itemsPerPage.value = settings.itemsPerPage
  namespaceSeparator.value = settings.namespaceSeparator
  leftPaneSize.value = settings.leftPaneSize
})

const redis = useRedis()
const keysStore = useKeysStore()
const toaster = useToaster()
const save = async () => {
  database.data.settings = {
    itemsPerPage: redis.pageSize = itemsPerPage.value,
    namespaceSeparator: redis.namespaceSeparator = namespaceSeparator.value,
    leftPaneSize: leftPaneSize.value,
  }

  await database.write()

  toaster.success('Saved')
  keysStore.loadKeys()
  emit('close')
}
</script>

<style scoped>
table th {
  width: 33.3%;
  text-align: right;
  white-space: nowrap;
}

table td {
  text-align: left;
}

table th, table td {
  @apply p-1
}
</style>
