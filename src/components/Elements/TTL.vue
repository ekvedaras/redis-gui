<template>
  <div class="flex">
    <div tabindex="0"
         class="flex cursor-pointer rounded text-gray-500 hover:bg-red-200 focus:bg-red-200 hover:text-redis dark:hover:bg-redis-700 dark:focus:bg-redis-700 dark:hover:text-redis-300 focus:text-redis"
         :class="{'text-gray-500': redisKey.ttl < 1}"
         ref="ttlText"
         @keydown.enter="startEditing"
         @click="startEditing"
         v-shortkey="['t']"
         @shortkey="startEditing"
         v-tooltip="'Set TTL (Time To Live) in seconds. Use <code><b>-1</b></code> to disable.'">
      <TimeIcon class="w-4 m-1"/>
      <div v-show="!isEditing" v-if="redisKey.ttl > -1">
        <span class="ml-2" v-if="seconds < 60">Expires in {{ [seconds, 'seconds'] | duration('as', 'seconds') }} seconds</span>
        <span class="ml-2" v-else>Expires in {{ [seconds, 'seconds'] | duration('humanize') }}</span>
      </div>
    </div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <input ref="ttlField" v-show="isEditing" v-model="newTtl" @keydown.esc="edit(false)" @keydown.enter="edit(true)" @blur="edit(true)" type="text" placeholder="TTL seconds" class="text-sm py-0 px-2"/>
  </div>
</template>

<script>
import TimeIcon from '@/components/Icons/TimeIcon'
import { redis } from '@/services/redis'
import { mapMutations } from 'vuex'

export default {
  name: 'TTL',
  components: { TimeIcon },
  props: ['redisKey'],
  data: () => ({
    isEditing: false,
    newTtl: 0,
  }),
  computed: {
    seconds () {
      return this.redisKey.ttl || 0
    },
  },
  methods: {
    ...mapMutations('keys', ['updateKey']),
    startEditing () {
      this.isEditing = true
      this.newTtl = this.seconds
      this.$nextTick(() => this.$refs.ttlField.focus())
    },
    edit (save) {
      if (save && this.isEditing && this.newTtl !== this.redisKey.ttl) {
        if (this.newTtl < 1) {
          redis.async('persist', this.redisKey.name).then(() => {
            this.updateKey({ ...this.redisKey, ttl: -1 })
          }).finally(() => {
            this.isEditing = false
            this.$nextTick(() => this.$refs.ttlText.focus())
          })
        } else {
          redis.async('expire', this.redisKey.name, this.newTtl).then(() => {
            this.updateKey({ ...this.redisKey, ttl: this.newTtl })
          }).finally(() => {
            this.isEditing = false
            this.$nextTick(() => this.$refs.ttlText.focus())
          })
        }
      } else {
        this.isEditing = false
        this.$nextTick(() => this.$refs.ttlText.focus())
      }
    },
  },
}
</script>

<style scoped>

</style>
