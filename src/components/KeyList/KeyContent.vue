<template>
  <div>
    <NoKeySelected v-if="!current"/>
    <template v-else>
      <div class="flex pt-2 items-center">
        <KeyIcon :redis-key="current" class="mr-2"/>
        <h2 class="text-xl flex-1">
          <span ref="keyName" tabindex="0" v-show="!isRenaming" v-tooltip="'Click to edit'" v-shortkey="['e']" @shortkey="startRename" @keydown.enter="startRename" @click="startRename">{{ current.name }}</span>
          <!--suppress HtmlFormInputWithoutLabel -->
          <input ref="renameField" v-show="isRenaming" v-model="newName" @keydown.esc="rename(false)" @keydown.enter="rename(true)" @blur="rename(true)" type="text" placeholder="New name..." class="p-1 text-sm"/>
          <span @click="openDocs" class="text-sm ml-2" style="cursor: help">{{ current.type }} ({{ current.encoding }})</span>
        </h2>
        <IconButton @click="confirmDelete" tabindex="0" v-shortkey="['d']" @shortkey.native="confirmDelete">
          <DeleteIcon class="w-4 m-1"/>
        </IconButton>
        <TTL :redis-key="current"/>
      </div>
      <component v-if="currentContent"
                 :is="currentContent"
                 :name="current.name"
                 :key="current.name"
                 v-shortkey.once="['r']"
                 @shortkey.native="emitUpdate"
                 class="h-full p-4 pb-24"
      />
      <template v-else>
        Key type {{ current.type }} is not supported
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
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
import IconButton from '@/components/Elements/IconButton'
import Dialog from '@/components/Modals/Dialog'
import { EventBus } from '@/services/eventBus'
import KeyIcon from '@/components/KeyList/KeyIcon'
import IFrameModal from '@/components/Modals/IFrameModal'

export default {
  name: 'KeyContent',
  components: {
    KeyIcon,
    IconButton,
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
    ...mapMutations('keys', ['addKey', 'select', 'removeKey']),
    ...mapActions('keys', ['deleteKey', 'loadKeyInfo']),
    ...mapActions('databases', ['load']),
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
          this.addKey({ ...this.current, name: newName })
          this.select(newName)
          this.removeKey({ name: oldName })
          this.loadKeyInfo({ name: newName })
        }).finally(() => {
          this.isRenaming = false
          this.$nextTick(() => this.$refs.keyName.focus())
        })
      } else {
        this.isRenaming = false
        this.$nextTick(() => this.$refs.keyName.focus())
      }
    },
    confirmDelete () {
      this.$modal.show(Dialog, {
        text: `Are you sure you want to delete <b>${this.selected}</b> key?`,
        handler: () => {
          this.deleteKey(this.selected)
          this.load()
          this.$modal.hide('dialog')
        },
      }, { name: 'dialog' })
    },
    emitUpdate () {
      EventBus.$emit('key-updated', this.selected)
    },
    openDocs () {
      this.$modal.show(IFrameModal, {
        title: `${this.current.type.substr(0, 1).toUpperCase()}${this.current.type.substr(1)} documentation`,
        url: this.typeDocs,
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
    typeDocs () {
      switch (this.current.type) {
        case 'hash':
          return 'https://redis.io/topics/data-types#hashes'
        case 'list':
          return 'https://redis.io/topics/data-types#lists'
        case 'set':
          return 'https://redis.io/topics/data-types#sets'
        case 'zset':
          return 'https://redis.io/topics/data-types#sorted-sets'
        case 'string':
          return 'https://redis.io/topics/data-types#strings'
        default:
          return 'https://redis.io/topics/data-types'
      }
    },
  },
}
</script>

<style scoped>

</style>
