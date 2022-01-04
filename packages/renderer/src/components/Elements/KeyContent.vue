<template>
  <div>
    <NoKeySelected v-if="!keysStore.current" />
    <template v-else>
      <div class="flex pt-2 items-center">
        <KeyIcon :redis-key="keysStore.current" class="mr-2" />
        <h2 class="text-xl flex-1">
          <span ref="keyName" class="break-all" tabindex="0" v-show="!isRenaming" @shortkey="startRename" @keydown.enter="startRename" @click="startRename">{{ keysStore.current.name }}</span>
          <!--suppress HtmlFormInputWithoutLabel -->
          <input ref="renameField" v-show="isRenaming" v-model="newName" @keydown.esc="rename(false)" @keydown.enter="rename(true)" @blur="rename(true)" type="text" placeholder="New name..." class="p-1 text-sm" />
          <span @click="openDocs" class="text-sm ml-2" style="cursor: help">{{ keysStore.current.type }} ({{ keysStore.current.encoding }})</span>
        </h2>
        <IconButton @click="confirmDelete" tabindex="0" @shortkey.native="confirmDelete">
          <DeleteIcon class="w-4 m-1" />
        </IconButton>
        <TTL :redis-key="keysStore.current" />
      </div>
      <component v-if="currentContent"
                 :is="currentContent"
                 :name="keysStore.current.name"
                 :key="keysStore.current.name"
                 @shortkey.native="emitUpdate"
                 class="h-full p-4 pb-24"
      />
      <template v-else>
        Key type {{ keysStore.current.type }} is not supported
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useKeysStore } from '/@/store/keys'
import { useDatabasesStore } from '/@/store/databases'
import { computed, nextTick, ref } from 'vue'
import { useRedis } from '/@/use/redis'
import { Key } from '../../../types/redis'
import KeyIcon from '/@/components/Elements/KeyIcon.vue'
import IconButton from '/@/components/Elements/IconButton.vue'
import DeleteIcon from '/@/components/Icons/DeleteIcon.vue'
import NoKeySelected from '/@/components/Elements/NoKeySelected.vue'
import TTL from '/@/components/Elements/TTL.vue'
import HashContent from '/@/components/Elements/Content/HashContent.vue'
import ListContent from '/@/components/Elements/Content/ListContent.vue'
import SetContent from '/@/components/Elements/Content/SetContent.vue'
import StringContent from '/@/components/Elements/Content/StringContent.vue'
import ZSetContent from '/@/components/Elements/Content/ZSetContent.vue'

const redis = useRedis()
const keysStore = useKeysStore()
const databasesStore = useDatabasesStore()

const renameField = ref<HTMLInputElement>()
const keyName = ref<HTMLSpanElement>()
const isRenaming = ref(false)
const newName = ref('')

const startRename = () => {
  isRenaming.value = true
  newName.value = keysStore.current?.name ?? ''
  nextTick(() => renameField.value?.focus())
}

const rename = async (save: boolean) => {
  if (save && isRenaming.value && newName.value !== keysStore.current?.name) {
    try {
      await redis.client.rename(keysStore.current?.name, newName.value)
      let oldKey = {...keysStore.current} as Key
      let _newName = newName.value
      keysStore.addKey({...keysStore.current!, name: _newName})
      keysStore.selected = _newName
      keysStore.removeKey(oldKey)
      keysStore.loadKeyInfo(_newName)
    } finally {
      isRenaming.value = false
      nextTick(() => keyName.value?.focus())
    }
  } else {
    isRenaming.value = false
    nextTick(() => keyName.value?.focus())
  }
}

const confirmDelete = () => {
  if (confirm('Sure? (TODO)')) {
    keysStore.deleteKey(keysStore.selected!)
    databasesStore.load()
  }
  // this.$modal.show(Dialog, {
  //   text: `Are you sure you want to delete <b>${ this.selected }</b> key?`,
  //   dangerBtn: true,
  //   handler: () => {
  //     this.deleteKey(this.selected)
  //     this.load()
  //     this.$modal.hide('dialog')
  //   },
  // }, {name: 'dialog'})
}

const emitUpdate = () => {
  alert('TODO: emit key-updated')
  // EventBus.$emit('key-updated', this.selected)
}

const typeDocs = computed(() => {
  switch (keysStore.current?.type) {
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
})

const openDocs = () => {
  alert('TODO: open docs modal')
  // this.$modal.show(IFrameModal, {
  //   title: `${ this.current.type.substr(0, 1).toUpperCase() }${ this.current.type.substr(1) } documentation`,
  //   url: this.typeDocs,
  // })
}

const currentContent = computed(() => {
  if (!keysStore.current) {
    return undefined
  }

  switch (keysStore.current.type) {
    case 'hash':
      return HashContent
    case 'list':
      return ListContent
    case 'set':
      return SetContent
    case 'zset':
      return ZSetContent
    default:
      return StringContent
  }
})
</script>

<style scoped>

</style>
