<template>
  <div class="flex items-start rounded cursor-pointer px-2 hover:bg-gray-200 dark:hover:bg-white-10p" :class="{'font-bold text-redis': isSelected}" tabindex="1" @keypress.enter="select(redisKey.name)" @click="select(redisKey.name)">
    <LevelTab :level="level"></LevelTab>
    <KeyIcon :redis-key="redisKey" v-tooltip="redisKey.type"/>
    <div class="ml-2 flex-1">{{ nameWithDots }}</div>
    <TimeIcon class="w-3 mt-1-5 text-gray-600" v-if="redisKey.ttl > -1" v-tooltip="expiresIn"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import LevelTab from '@/components/KeyList/LevelTab'
import TimeIcon from '@/components/Icons/TimeIcon'
import KeyIcon from '@/components/KeyList/KeyIcon'
import { redis } from '@/services/redis'

export default {
  name: 'Key',
  components: { KeyIcon, TimeIcon, LevelTab },
  props: ['redisKey', 'name', 'level'],
  methods: mapMutations('keys', ['select']),
  computed: {
    ...mapGetters('keys', ['current']),
    nameWithDots () {
      if (redis.namespaceSeparator === '.') {
        return this.name
      }

      return this.name.replaceAll('◦', '.')
    },
    isSelected () {
      return this.current && this.redisKey.name === this.current.name
    },
    expiresIn () {
      return `Expires in ${this.$options.filters.duration([this.redisKey.ttl, 'seconds'], 'humanize')}`
    },
  },
}
</script>

<style scoped>

</style>
