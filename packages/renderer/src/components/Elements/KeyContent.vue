<script setup lang="ts">
import { useKeysStore } from '/@/store/keys'
import { useDatabasesStore } from '/@/store/databases'
import { computed, nextTick, ref } from 'vue'
import { useRedis } from '/@/use/redis'
import type { Key } from 'types/redis'
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
import ConfirmDialog from '/@/components/Elements/ConfirmDialog.vue'
import IFrameModal from '/@/components/Elements/IFrameModal.vue'
import useEmitter from '/@/use/emitter'

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
      let oldKey = { ...keysStore.current } as Key
      let _newName = newName.value
      if (keysStore.current) {
        keysStore.addKey({ ...keysStore.current, name: _newName })
      }
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

const showDeleteDialog = ref(false)
const deleteKey = () => {
  keysStore.selected && keysStore.deleteKey(keysStore.selected)
  databasesStore.load()
  showDeleteDialog.value = false
}

const emitter = useEmitter()
const emitUpdate = () => emitter.emit('key-updated', keysStore.selected)

const showDocs = ref(false)
const docsTitle = computed(() => `${ keysStore.current?.type.substring(0, 1).toUpperCase() }${ keysStore.current?.type.substr(1) } documentation`)
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

<template>
  <div>
    <NoKeySelected v-if="!keysStore.current" />
    <template v-else>
      <div v-shortkey="['r']" class="flex pt-2 items-center" @shortkey="emitUpdate">
        <KeyIcon :redis-key="keysStore.current" class="mr-2" />
        <h2 class="text-xl flex-1">
          <span v-show="!isRenaming" ref="keyName" v-tooltip="'Click to edit'" v-shortkey="['e']" class="break-all" tabindex="0" @shortkey="startRename" @keydown.enter="startRename" @click="startRename">{{ keysStore.current.name }}</span>
          <!--suppress HtmlFormInputWithoutLabel -->
          <input v-show="isRenaming" ref="renameField" v-model="newName" type="text" placeholder="New name..." class="p-1 text-sm" @keydown.esc="rename(false)" @keydown.enter="rename(true)" @blur="rename(true)" />
          <span class="text-sm ml-2" style="cursor: help" @click="showDocs = true">{{ keysStore.current.type }} ({{ keysStore.current.encoding }})</span>
        </h2>
        <IconButton v-shortkey="['d']" tabindex="0" @shortkey="showDeleteDialog = true" @click="showDeleteDialog = true">
          <DeleteIcon class="w-4 m-1" />
        </IconButton>
        <TTL :redis-key="keysStore.current" />
      </div>
      <component
        :is="currentContent"
        v-if="currentContent"
        :key="keysStore.current.name"
        :name="keysStore.current.name"
        class="h-full p-4 pb-24"
      />
      <template v-else>
        Key type {{ keysStore.current.type }} is not supported
      </template>
      <ConfirmDialog v-if="showDeleteDialog" danger @close="showDeleteDialog = false" @confirm="deleteKey">
        Are you sure you want to delete <b>{{ keysStore.selected }}</b> key?
      </ConfirmDialog>
      <IFrameModal v-if="showDocs" :url="typeDocs" :title="docsTitle" @close="showDocs = false" />
    </template>
  </div>
</template>
