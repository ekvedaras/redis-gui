<template>
  <div class="flex cursor-pointer hover:bg-gray-200" :class="{'bg-red-200': redisKey.name === currentKey.name}" @click="setCurrentKey(redisKey)">
    <LevelTab :level="level"></LevelTab>
    <component :is="icon" class="w-5 text-gray-600"/>
    <div class="ml-2">{{ name }} ({{ redisKey.type }})</div>
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
