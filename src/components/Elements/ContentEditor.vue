<template>
  <div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <textarea ref="editor"
              :value="value"
              @input="$emit('input', $event.target.value)"
              @keydown.esc="$emit('close')"
              @keydown.ctrl.enter="$emit('save')"
              class="w-full h-64"/>
    <span class="text-xs text-gray-500">CTRL + Enter to save, Esc to cancel</span>
  </div>
</template>

<script>
export default {
  name: 'ContentEditor',
  props: {
    value: {
      required: true,
    },
  },
  mounted () {
    this.$refs.editor.focus()
  },
}
</script>

<style scoped>

</style>
