<script setup lang="ts">
import IconButton from '/@/components/Elements/IconButton.vue'
import AddIcon from '/@/components/Icons/AddIcon.vue'
import Search from '/@/components/Elements/Search.vue'
import type { ClickKeys } from 'types/models'
import { onBeforeMount, ref } from 'vue'
import type { AddModalFillOptions } from '/@/components/Elements/AddKeyModal.vue'
import AddKeyModal from '/@/components/Elements/AddKeyModal.vue'

const props = withDefaults(defineProps<{
  value: string,
  showSpinner: boolean,
  withAdd: boolean,
  addName?: AddModalFillOptions['name'],
  addType?: AddModalFillOptions['type'],
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

const addModalFill = ref<AddModalFillOptions>({})
onBeforeMount(() => {
  if (props.addName) {
    addModalFill.value.name = props.addName
  }

  if (props.addType) {
    addModalFill.value.type = props.addType
  }
})

const emit = defineEmits<{
  (e: 'update:value', value: string): void,
}>()

const showKeyAddModal = ref(false)
</script>

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
      v-shortkey="addKeys"
      @click="showKeyAddModal = true"
      @shortkey="showKeyAddModal = true"
    >
      <AddIcon class="w-10" />
    </IconButton>
    <AddKeyModal
      v-if="showKeyAddModal" :fill="addModalFill" @close="showKeyAddModal = false"
    />
  </div>
</template>
