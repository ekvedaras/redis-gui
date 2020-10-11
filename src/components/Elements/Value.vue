<template>
  <div>
    <div v-if="!isEditing && itemKey" class="sticky top-0 font-bold z-10 bg-gray-100">{{ itemKey }}</div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <input type="text" v-if="isEditing && itemKey" v-model="editKey" @keydown.esc="isEditing = false" @keydown.ctrl.enter="save" class="p-1 shadow rounded"/>
    <div v-if="!isEditing">
      <KeyItemControls @edit="isEditing = true" @delete="$emit('delete')" :without-delete="withoutDelete"/>
      <ValueRenderer :value="value" class="mb-4"/>
    </div>
    <ContentEditor v-else v-model="editValue" @close="isEditing = false" @save="save"/>
  </div>
</template>

<script>
import KeyItemControls from '@/components/Elements/KeyItemControls'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import ContentEditor from '@/components/Elements/ContentEditor'

export default {
  name: 'Value',
  components: { ContentEditor, ValueRenderer, KeyItemControls },
  props: {
    value: {
      required: true,
    },
    itemKey: {
      default: false,
    },
    withoutDelete: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      editValue: this.value,
      editKey: this.itemKey,
      isEditing: false,
    }
  },
  watch: {
    value (value) {
      this.editValue = value
    },
  },
  methods: {
    save () {
      this.isEditing = false
      this.$emit('save', { key: this.editKey, value: this.editValue })
    },
  },
}
</script>

<style scoped>

</style>
