<template>
  <div class="p-4">
    <div v-if="!isEditing" class="relative">
      <KeyItemControls @edit="edit" without-delete/>
      <ValueRenderer :value="value"/>
    </div>
    <div v-if="isEditing">
      <textarea class="p-2 w-full shadow h-64" ref="editor" v-model="value" @keydown.esc="isEditing = false" @keydown.ctrl.enter="save"/>
      <span class="text-xs text-gray-500">CTRL + Enter to save, Esc to cancel</span>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import KeyItemControls from '@/components/Elements/KeyItemControls'

export default {
  name: 'StringContent',
  components: { KeyItemControls, ValueRenderer },
  props: ['name'],
  data: () => ({
    isEditing: false,
    value: '',
  }),
  async mounted () {
    this.value = await redis.async('get', this.name)
  },
  methods: {
    edit () {
      this.isEditing = true
      this.$nextTick(() => this.$refs.editor.focus())
    },
    save () {
      redis.async('set', this.name, this.value)
          .then(() => this.$toasted.success('Saved'))
          .finally(() => this.isEditing = false)
    },
  },
}
</script>

<style scoped>

</style>
