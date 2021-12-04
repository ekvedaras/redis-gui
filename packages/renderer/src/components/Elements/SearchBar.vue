<template>
  <div class="flex justify-center items-center space-x-2">
    <Search
      :value="props.value"
      :focus-keys="props.focusKeys"
      :show-spinner="props.showSpinner"
      @input="emit('input')"
    />
    <IconButton
      v-if="props.withAdd"
      @click="showKeyAddModal"
      @shortkey="showKeyAddModal"
    >
      <AddIcon class="w-10" />
    </IconButton>
  </div>
</template>

<script setup lang="ts">
import IconButton from '/@/components/Elements/IconButton.vue'
import AddIcon from '/@/components/Icons/AddIcon.vue'
import Search from '/@/components/Elements/Search.vue'
import type { ClickKeys } from '../../../types/models'

const props = withDefaults(defineProps<{
  value: string,
  showSpinner: boolean,
  withAdd: boolean,
  addName?: string,
  addType?: string,
  focusKeys: ClickKeys,
  addKeys: ClickKeys,
}>(), {
  showSpinner: false,
  withAdd: false,
  addName: undefined,
  addType: undefined,
  focusKeys: () => ({main: ['/']}) as ClickKeys,
  addKeys: () => ({main: ['a']}) as ClickKeys,
})

const emit = defineEmits<{
  (e: 'input'): void,
}>()

const showKeyAddModal = () => console.error('TODO: showKeyAddModal')
</script>

<style scoped>

</style>
