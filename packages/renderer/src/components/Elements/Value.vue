<script setup lang="ts">
import { ref, toRef } from 'vue'
import ContentEditor from '/@/components/Elements/ContentEditor.vue'
import ValueRenderer from '/@/components/Elements/ValueRenderer.vue'
import { useToaster } from '/@/use/toaster'

const props = withDefaults(defineProps<{
  value: string,
  itemKey?: string,
  withoutDelete?: boolean,
}>(), {
  itemKey: '',
  withoutDelete: false,
})

const emit = defineEmits<{
  (e: 'save', value: { value: string, key: string }): void,
  (e: 'delete'): void,
}>()

const toaster = useToaster()

const editValue = toRef(props, 'value')
const editKey = toRef(props, 'itemKey')
const isEditing = ref(false)

const save = () => {
  isEditing.value = false
  emit('save', { key: editKey.value, value: editValue.value })
}

const copy = () => {
  // this.$copyText(value.value)
  toaster.info('Copied (TODO)')
}
</script>

<template>
  <div>
    <div v-if="!isEditing && itemKey" class="sticky top-0 font-bold z-20 bg-gray-100 dark:bg-gray-900">
      {{ itemKey }}
    </div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <input v-if="isEditing && itemKey" v-model="editKey" type="text" class="my-1 mx-1 text-sm" @keydown.esc="isEditing = false" @keydown.ctrl.enter="save" />
    <div v-if="!isEditing">
      <ValueRenderer :value="value" class="mb-4" :without-delete="withoutDelete" :with-keys="!!itemKey" @edit="isEditing = true" @delete="emit('delete')" @copy="copy" />
    </div>
    <ContentEditor v-else v-model:value="editValue" class="mx-1" @close="isEditing = false" @save="save" />
  </div>
</template>
