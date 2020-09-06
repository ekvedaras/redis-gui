<template>
  <div class="flex cursor-pointer px-2 hover:bg-white-10p" :class="{'font-bold text-redis': isSelected}" tabindex="1" @keypress.enter="select(redisKey.name)" @click="select(redisKey.name)">
    <LevelTab :level="level"></LevelTab>
    <component :is="icon" class="w-5"/>
    <div class="ml-2 flex-1">{{ name }}</div>
    <TimeIcon class="w-3 text-gray-600" v-if="redisKey.ttl > -1"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import StringIcon from '@/components/Icons/StringIcon'
import SetIcon from '@/components/Icons/SetIcon'
import ZsetIcon from '@/components/Icons/ZsetIcon'
import LevelTab from '@/components/KeyList/LevelTab'
import ListIcon from '@/components/Icons/ListIcon'
import HashIcon from '@/components/Icons/HashIcon'
import TimeIcon from '@/components/Icons/TimeIcon'

export default {
  name: 'Key',
  components: { TimeIcon, LevelTab, StringIcon },
  props: ['redisKey', 'name', 'level'],
  methods: mapMutations(['select']),
  computed: {
    ...mapGetters(['currentKey']),
    isSelected () {
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
