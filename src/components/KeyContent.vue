<template>
  <div>
    <template v-if="!currentKey">
      <span class="text-xl2 font-light">Select key</span>
    </template>
    <template v-else>
      <div class="flex">
        <h2 class="text-xl flex-1">{{ currentKey.name }}</h2>
        <div>Controls todo</div>
      </div>
      <div>
        <component v-if="currentType" :is="currentType" :name="currentKey.name" :key="currentKey.name"/>
        <template v-else>
          Key type {{ currentKey.type }} is not supported
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import StringContent from '@/components/Content/StringContent'
import ListContent from '@/components/Content/ListContent'
import SetContent from '@/components/Content/SetContent'
import ZsetContent from '@/components/Content/ZsetContent'
import HashContent from '@/components/Content/HashContent'

export default {
  name: 'KeyContent',
  components: { StringContent, ListContent, SetContent, ZsetContent, HashContent },
  computed: {
    ...mapState(['currentKey']),
    currentType () {
      if (!this.currentKey) {
        return undefined
      }

      const type = this.currentKey.type
      const component = `${type.charAt(0).toUpperCase()}${type.slice(1)}Content`

      if (!Object.prototype.hasOwnProperty.call(this.$options.components, component)) {
        return undefined
      }

      return component
    },
  },
}
</script>

<style scoped>

</style>
