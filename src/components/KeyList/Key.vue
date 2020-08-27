<template>
  <div class="flex cursor-pointer hover:bg-gray-200" :class="{'font-bold text-red-700': isSelected}" @click="setCurrentKey(redisKey)">
    <LevelTab :level="level"></LevelTab>
    <component :is="icon" :class="['w-5', isSelected ? 'text-red-700' : 'text-gray-600']" :title="redisKey.type"/>
    <div class="ml-2">{{ name }}</div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import StringIcon from '@/components/Icons/StringIcon'
import SetIcon from '@/components/Icons/SetIcon'
import ZsetIcon from '@/components/Icons/ZsetIcon'
import LevelTab from '@/components/KeyList/LevelTab'
import ListIcon from '@/components/Icons/ListIcon'
import HashIcon from '@/components/Icons/HashIcon'

export default {
  name: 'Key',
  components: { LevelTab, StringIcon },
  props: ['redisKey', 'name', 'level'],
  methods: mapMutations(['setCurrentKey']),
  computed: {
    ...mapState(['currentKey']),
    isSelected() {
      return this.currentKey && this.redisKey.name === this.currentKey.name
    },
    icon () {
      switch (this.redisKey.type) {
        case 'string':
          return StringIcon
        case 'zset':
          return ZsetIcon
        case 'set':
          return SetIcon
        case 'list':
          return ListIcon
        case 'hash':
          return HashIcon
        default:
          return StringIcon
      }
    },
  },
}
</script>

<style scoped>

</style>
