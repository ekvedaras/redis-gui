<template>
  <div>
    <div v-if="!isEditing && itemKey" class="sticky top-0 font-bold z-20 bg-gray-100 dark:bg-gray-900">{{ itemKey }}</div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <input type="text" v-if="isEditing && itemKey" v-model="editKey" @keydown.esc="isEditing = false" @keydown.ctrl.enter="save" class="my-1 mx-1 text-sm" />
    <div v-if="!isEditing">
      <ValueRenderer :value="value" class="mb-4" @edit="isEditing = true" @delete="$emit('delete')" @copy="copy" :without-delete="withoutDelete" :with-keys="!!itemKey" />
    </div>
    <ContentEditor v-else v-model="editValue" @close="isEditing = false" @save="save" class="mx-1" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue'

const props = withDefaults(defineProps<{
  value: string,
  itemKey?: boolean,
  withoutDelete?: boolean,
}>(), {
  itemKey: false,
  withoutDelete: false,
})

const emit = defineEmits<{
  (e: 'save', value: { value: string, key: string }): void,
}>()

const editValue = toRef(props, 'value')
const editKey = toRef(props, 'itemKey')
const isEditing = ref(false)

const save = () => {
  this.isEditing = false
  this.$emit('save', {key: this.editKey, value: this.editValue})
}

const copy = () => {
  this.$copyText(this.value)
  this.$toasted.info('Copied')
}
</script>

<style scoped>

</style>
