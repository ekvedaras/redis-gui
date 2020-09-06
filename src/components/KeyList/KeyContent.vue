<template>
  <div class="h-full overflow-auto relative">
    <template v-if="!currentKey">
      <span class="text-xl2 font-light">Select key</span>
    </template>
    <template v-else>
      <div class="flex sticky top-0 bg-white pt-2 items-center">
        <component class="mr-2 w-6" v-if="currentIcon" :is="currentIcon"/>
        <h2 class="text-xl flex-1">
          <span ref="keyName" tabindex="0" v-show="!isRenaming" @keydown.enter="startRename" @click="startRename">{{ currentKey.name }}</span>
          <!--suppress HtmlFormInputWithoutLabel -->
          <input ref="renameField" v-show="isRenaming" v-model="newName" @keydown.esc="rename(false)" @keydown.enter="rename(true)" @blur="rename(true)" type="text" placeholder="New name..." class="rounded shadow-md text-sm py-0 px-2"/>
          <span class="text-sm ml-2">{{ currentKey.type }} ({{ currentKey.encoding }})</span>
        </h2>
        <TTL v-if="currentKey.ttl > -1" :seconds="currentKey.ttl"/>
      </div>
      <div>
        <component class="max-h-full overflow-y-auto" v-if="currentContent" :is="currentContent" :name="currentKey.name" :key="currentKey.name"/>
        <template v-else>
          Key type {{ currentKey.type }} is not supported
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { redis } from '@/services/redis'
import StringContent from '@/components/Content/StringContent'
import ListContent from '@/components/Content/ListContent'
import SetContent from '@/components/Content/SetContent'
import ZsetContent from '@/components/Content/ZsetContent'
import HashContent from '@/components/Content/HashContent'
import StringIcon from '@/components/Icons/StringIcon'
import ListIcon from '@/components/Icons/ListIcon'
import SetIcon from '@/components/Icons/SetIcon'
import ZsetIcon from '@/components/Icons/ZsetIcon'
import HashIcon from '@/components/Icons/HashIcon'
import TimeIcon from '@/components/Icons/TimeIcon'
import TTL from '@/components/Elements/TTL'

export default {
  name: 'KeyContent',
  components: {
    TTL,
    TimeIcon,
    StringContent, ListContent, SetContent, ZsetContent, HashContent,
    StringIcon, ListIcon, SetIcon, ZsetIcon, HashIcon,
  },
  data: () => ({
    isRenaming: false,
    newName: '',
  }),
  methods: {
    startRename () {
      this.isRenaming = true
      this.newName = this.currentKey.name
      this.$nextTick(() => this.$refs.renameField.focus())
    },
    rename (save) {
      if (save && this.isRenaming && this.newName !== this.currentKey.name) {
        redis.async('rename', this.currentKey.name, this.newName).then(() => {
          let oldName = this.currentKey.name
          let newName = this.newName
          this.$store.commit('addKey', { ...this.currentKey, name: newName })
          this.$store.commit('select', newName)
          this.$store.commit('removeKey', { name: oldName })
        }).finally(() => {
          this.isRenaming = false
          this.$nextTick(() => this.$refs.keyName.focus())
        })
      } else {
        this.isRenaming = false
        this.$nextTick(() => this.$refs.keyName.focus())
      }
    },
  },
  computed: {
    ...mapGetters(['currentKey']),
    ...mapState(['selected']),
    currentContent () {
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
    currentIcon () {
      if (!this.currentKey) {
        return undefined
      }

      const type = this.currentKey.type
      const component = `${type.charAt(0).toUpperCase()}${type.slice(1)}Icon`

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
