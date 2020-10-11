<template>
  <div class="p-4">
    <div v-if="!isEditing" class="relative">
      <KeyItemControls @edit="isEditing = true" without-delete/>
      <ValueRenderer :value="value"/>
    </div>
    <ContentEditor v-if="isEditing" v-model="value" @close="isEditing = false" @save="save"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import KeyItemControls from '@/components/Elements/KeyItemControls'
import ContentEditor from '@/components/Elements/ContentEditor'

export default {
  name: 'StringContent',
  components: { ContentEditor, KeyItemControls, ValueRenderer },
  props: ['name'],
  data: () => ({
    isEditing: false,
    value: '',
  }),
  async mounted () {
    this.value = await redis.async('get', this.name)
  },
  methods: {
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
