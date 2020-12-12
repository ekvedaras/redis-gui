<template>
  <div class="relative group">
    <JsonRenderer v-if="shouldAttemptJson && isJSON(value)" :data="value" @edit="$emit('edit')" @delete="$emit('delete')" @copy="$emit('copy')" :without-delete="withoutDelete" :with-keys="withKeys"/>
    <PlainRenderer v-else :data="value" @edit="$emit('edit')" @delete="$emit('delete')" @copy="$emit('copy')" :without-delete="withoutDelete" :with-keys="withKeys"/>
  </div>
</template>

<script>
import { isJSON } from '@/services/json'
import JsonRenderer from '@/components/Renderer/JsonRenderer'
import PlainRenderer from '@/components/Renderer/PlainRenderer'

export default {
  name: 'ValueRenderer',
  components: { PlainRenderer, JsonRenderer },
  props: ['value', 'withoutDelete', 'withKeys'],
  methods: { isJSON },
  computed: {
    shouldAttemptJson () {
      return this.value.length < 1024 * 10 && (this.value.startsWith('[') || this.value.startsWith('{'))
    },
  },
}
</script>

<style scoped>

</style>
