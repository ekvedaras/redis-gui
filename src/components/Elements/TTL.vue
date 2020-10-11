<template>
  <div class="flex">
    <div tabindex="0"
         class="flex cursor-pointer hover:bg-red-200 focus:bg-red-200 rounded hover:text-redis focus:text-redis"
         :class="{'text-gray-500': redisKey.ttl < 1}"
         ref="ttlText"
         @keydown.enter="startEditing"
         @click="startEditing">
      <TimeIcon class="w-4 m-1"/>
      <div v-show="!isEditing" v-if="redisKey.ttl > -1">
        <span class="ml-2" v-if="seconds < 60">Expires in {{ [seconds, 'seconds'] | duration('as', 'seconds') }} seconds</span>
        <span class="ml-2" v-else>Expires in {{ [seconds, 'seconds'] | duration('humanize') }}</span>
      </div>
    </div>
    <!--suppress HtmlFormInputWithoutLabel -->
    <input ref="ttlField" v-show="isEditing" v-model="newTtl" @keydown.esc="edit(false)" @keydown.enter="edit(true)" @blur="edit(true)" type="text" placeholder="TTL seconds" class="rounded shadow-md text-sm py-0 px-2"/>
  </div>
</template>

<script>
import TimeIcon from '@/components/Icons/TimeIcon'
import { redis } from '@/services/redis'

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
    startEditing () {
      this.isEditing = true
      this.newTtl = this.seconds
      this.$nextTick(() => this.$refs.ttlField.focus())
    },
    edit (save) {
      if (save && this.isEditing && this.newTtl !== this.redisKey.ttl) {
        if (this.newTtl < 1) {
          redis.async('persist', this.redisKey.name).then(() => {
            this.$store.commit('keys/updateKey', { ...this.redisKey, ttl: -1 })
          }).finally(() => {
            this.isEditing = false
            this.$nextTick(() => this.$refs.ttlText.focus())
          })
        } else {
          redis.async('expire', this.redisKey.name, this.newTtl).then(() => {
            this.$store.commit('keys/updateKey', { ...this.redisKey, ttl: this.newTtl })
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
