<script setup lang="ts">
import { ref } from 'vue'
import ContentEditor from '/@/components/Elements/ContentEditor.vue'
import ValueRenderer from '/@/components/Elements/ValueRenderer.vue'
import { useToaster } from '/@/use/toaster'
import useClipboard from 'vue-clipboard3'

const props = withDefaults(defineProps<{
  value: string,
  itemKey?: string | number,
  withoutDelete?: boolean,
}>(), {
  itemKey: '',
  withoutDelete: false,
})

const emit = defineEmits<{
  (e: 'save', value: { value: string, key: typeof props.itemKey }): void,
  (e: 'delete'): void,
}>()

const toaster = useToaster()

const editKey = ref(props.itemKey)
const isEditing = ref(false)

const save = (newValue?: string) => {
  emit('save', {key: editKey.value, value: newValue ?? props.value})
  isEditing.value = false
}

const {toClipboard} = useClipboard()
const copy = async () => {
  await toClipboard(props.value)
  toaster.info('Copied')
}
</script>

<template>
  <div>
    <div v-if="!isEditing && itemKey" class="sticky top-0 font-bold z-20 bg-gray-100 dark:bg-gray-900">
      {{ itemKey }}
    </div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <input v-if="isEditing && itemKey" v-model="editKey" type="text" class="my-1 mx-1 text-sm" @keydown.esc="isEditing = false" @keydown.ctrl.enter="save()" />
    <div v-if="!isEditing">
      <ValueRenderer :value="value" class="mb-4" :without-delete="withoutDelete" :with-keys="!!itemKey" @edit="isEditing = true" @delete="emit('delete')" @copy="copy" />
    </div>
    <ContentEditor v-else :value="value" class="mx-1" @close="isEditing = false" @save="save" />
  </div>
</template>
