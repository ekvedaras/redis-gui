<template>
  <div>
    <NoKeySelected v-if="!current"/>
    <template v-else>
      <div class="flex pt-2 items-center">
        <component class="mr-2 w-6" v-if="currentIcon" :is="currentIcon"/>
        <h2 class="text-xl flex-1">
          <span ref="keyName" tabindex="0" v-show="!isRenaming" @keydown.enter="startRename" @click="startRename">{{ current.name }}</span>
          <!--suppress HtmlFormInputWithoutLabel -->
          <input ref="renameField" v-show="isRenaming" v-model="newName" @keydown.esc="rename(false)" @keydown.enter="rename(true)" @blur="rename(true)" type="text" placeholder="New name..." class="rounded shadow-md text-sm py-0 px-2"/>
          <span class="text-sm ml-2">{{ current.type }} ({{ current.encoding }})</span>
        </h2>
        <div @click="deleteKey" tabindex="0" class="mr-2">
          <DeleteIcon class="w-5 cursor-pointer text-gray-500 hover:text-redis"/>
        </div>
        <TTL :redis-key="current"/>
      </div>
      <component class="h-full" v-if="currentContent" :is="currentContent" :name="current.name" :key="current.name"/>
      <template v-else>
        Key type {{ current.type }} is not supported
      </template>
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
import DeleteIcon from '@/components/Icons/DeleteIcon'
import NoKeySelected from '@/components/KeyList/NoKeySelected'

export default {
  name: 'KeyContent',
  components: {
    NoKeySelected,
    DeleteIcon,
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
      this.newName = this.current.name
      this.$nextTick(() => this.$refs.renameField.focus())
    },
    rename (save) {
      if (save && this.isRenaming && this.newName !== this.current.name) {
        redis.async('rename', this.current.name, this.newName).then(() => {
          let oldName = this.current.name
          let newName = this.newName
          this.$store.commit('keys/addKey', { ...this.current, name: newName })
          this.$store.commit('keys/select', newName)
          this.$store.commit('keys/removeKey', { name: oldName })
        }).finally(() => {
          this.isRenaming = false
          this.$nextTick(() => this.$refs.keyName.focus())
        })
      } else {
        this.isRenaming = false
        this.$nextTick(() => this.$refs.keyName.focus())
      }
    },
    deleteKey () {
      this.$modal.show('dialog', {
        title: 'Confirm',
        text: `Are you sure you want to delete <b>${this.selected}</b> key?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => this.$modal.hide('dialog'),
          },
          {
            title: 'Confirm',
            handler: () => {
              this.$store.dispatch('deleteKey', this.selected)
              this.$modal.hide('dialog')
            },
          },
        ],
      })
    },
  },
  computed: {
    ...mapGetters('keys', ['current']),
    ...mapState('keys', ['selected']),
    currentContent () {
      if (!this.current) {
        return undefined
      }

      const type = this.current.type
      const component = `${type.charAt(0).toUpperCase()}${type.slice(1)}Content`

      if (!Object.prototype.hasOwnProperty.call(this.$options.components, component)) {
        return undefined
      }

      return component
    },
    currentIcon () {
      if (!this.current) {
        return undefined
      }

      const type = this.current.type
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
