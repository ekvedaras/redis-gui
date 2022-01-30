<template>
  <div class="flex justify-center items-center space-x-2">
    <Search
      :value="props.value"
      :focus-keys="props.focusKeys"
      :show-spinner="props.showSpinner"
      @update:value="emit('update:value', $event)"
    />
    <IconButton
      v-if="props.withAdd"
      @click="showKeyAddModal = true"
    >
      <AddIcon class="w-10" />
    </IconButton>
    <AddKeyModal v-model:show="showKeyAddModal" />
  </div>
</template>

<script setup lang="ts">
import IconButton from '/@/components/Elements/IconButton.vue'
import AddIcon from '/@/components/Icons/AddIcon.vue'
import Search from '/@/components/Elements/Search.vue'
import type { ClickKeys } from '../../../types/models'
import { onMounted, ref } from 'vue'
import AddKeyModal from '/@/components/Elements/AddKeyModal.vue'
import useHotKey from 'vue3-hotkey'

const props = withDefaults(defineProps<{
  value: string,
  showSpinner: boolean,
  withAdd: boolean,
  addName?: string,
  addType?: string,
  focusKeys?: ClickKeys,
  addKeys?: ClickKeys,
}>(), {
  showSpinner: false,
  withAdd: false,
  addName: undefined,
  addType: undefined,
  focusKeys: () => ({main: ['/']}) as ClickKeys,
  addKeys: () => ({main: ['a']}) as ClickKeys,
})

const emit = defineEmits<{
  (e: 'update:value', value: string): void,
}>()

const showKeyAddModal = ref(false)

onMounted(() => useHotKey([
  {
    keys: props.addKeys.main,
    preventDefault: true,
    handler: () => showKeyAddModal.value = true,
  },
]))
</script>

<style scoped>

</style>
