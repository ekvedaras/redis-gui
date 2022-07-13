<script setup lang="ts">
import { create, fromPairs, get, setWith, sortBy, toPairs } from 'lodash'
import { computed, ref, watch } from 'vue'
import { useKeysStore } from '/@/store/keys'
import { useServersStore } from '/@/store/servers'
import { useToaster } from '/@/use/toaster'
import type { Key } from '../../../types/redis'
import IconButton from '/@/components/Elements/IconButton.vue'
import TwitterIcon from '/@/components/Icons/TwitterIcon.vue'
import GitHubIcon from '/@/components/Icons/GitHubIcon.vue'
import LoadMoreButton from '/@/components/Elements/LoadMoreButton.vue'
import { useRedis } from '/@/use/redis'
import SearchBar from '/@/components/Elements/SearchBar.vue'
import Keys from '/@/components/Elements/Keys.vue'
import ShortKeyModal from '/@/components/Elements/ShortKeyModal.vue'
import ActionButton from '/@/components/Elements/ActionButton.vue'
import DeleteIcon from '/@/components/Icons/DeleteIcon.vue'
import ConfirmDialog from '/@/components/Elements/ConfirmDialog.vue'

const serverStore = useServersStore()
const keysStore = useKeysStore()
const toaster = useToaster()
const redis = useRedis()

const shouldShowShortKeysModal = ref(false)
const search = ref('')
const isLoading = ref(false)

const openTwitter = () => window.openExternal('https://twitter.com/ekvedaras')
const openGitHub = () => window.openExternal('https://github.com/ekvedaras/redis-gui')

const loadKeys = async (cursor = 0) => {
  isLoading.value = true
  try {
    const wildcard = search.value.indexOf('*') > -1 ? '' : '*'
    const result = await keysStore.loadKeys(`${ wildcard }${ search.value }${ wildcard }`, cursor)
    isLoading.value = result.wasCancelled
    return result
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  const result = await loadKeys(keysStore.cursor)
  toaster.info(`${ result.loaded } keys loaded`)
}

watch(() => search.value + serverStore.selected, () => loadKeys())

const nestKey = (grouped: object, path: string) => {
  let parts = path.split('.')
  let parentPath = parts.slice(0, -1).join('.')
  let key = get(grouped, parentPath)

  if (!key || !Object.prototype.hasOwnProperty.call(key, 'name')) {
    return [undefined, undefined]
  }

  setWith(grouped, parentPath, {}, Object)
  parts = parentPath.split('.')

  let lastPart = parts.splice(-1)
  let keyPath = parts.join('.')

  setWith(grouped, `${ keyPath }._${ lastPart }`, key, Object)

  return [key, keyPath]
}

const groupedKeys = computed(() => {
  const grouped: Record<string, Key> = {}

  Object.entries(keysStore.list).forEach(([name, key]) => {
    if (Object.prototype.hasOwnProperty.call(key, 'name')) {
      key.name = key.name.replaceAll('◦', '.')
      name = name.replaceAll('◦', '.')
    }

    if (name.indexOf(redis.namespaceSeparator) < 0) {
      grouped[name] = key
      return true
    }

    let path = redis.namespaceSeparator === '.'
      ? name
      : name.replace(new RegExp(redis.namespaceSeparator, 'g'), '.')

    let nestedKey, folderPath
    [nestedKey, folderPath] = nestKey(grouped, path)

    setWith(grouped, path, key, Object)

    if (nestedKey) {
      // Sort
      setWith(grouped, folderPath, create(fromPairs(sortBy(toPairs(get(grouped, folderPath)), 0)), Object))
    }
  })

  return grouped
})

const hideSelection = () => {
  keysStore.checkboxesVisible = false
  keysStore.selectedKeys = []
}

const selectAll = () => {
  keysStore.selectedKeys = Object.keys(keysStore.list)
}

const shouldShowDeleteSelectedDialog = ref(false)
const deleteSelectedKeys = () => {
  redis.client.del([...keysStore.selectedKeys.flatMap(keyToDelete => {
    if (keyToDelete.substring(keyToDelete.length - 1) === '*') {
      return Object.keys(keysStore.list).filter(loadedKey => loadedKey.substring(0, keyToDelete.length - 1) === keyToDelete.substring(0, keyToDelete.length - 1))
    }

    return keyToDelete
  })])
  hideSelection()
  loadKeys()
  shouldShowDeleteSelectedDialog.value = false
}
</script>

<template>
  <div class="flex flex-col h-full">
    <SearchBar
      v-model:value="search"
      :show-spinner="isLoading"
      with-add
      :focus-keys="{main: ['/'], forced: ['ctrl', '/']}"
      :add-keys="{main: ['a'], forced: ['ctrl', 'a']}"
      class="px-2"
    />
    <div class="px-2 mt-2 flex space-x-2">
      <ActionButton v-if="!keysStore.checkboxesVisible" class="flex-1" @click="keysStore.checkboxesVisible = true">
        Select keys
      </ActionButton>
      <template v-else>
        <ActionButton class="flex-1" @click="selectAll">
          Select all
        </ActionButton>
        <ActionButton class="flex-1" @click="hideSelection">
          Unselect keys
        </ActionButton>
        <ActionButton v-tooltip="'This will delete loaded keys only.'" class="hover:text-red-500" @click="shouldShowDeleteSelectedDialog = true">
          <DeleteIcon class="w-3 h-3" />
        </ActionButton>
      </template>
    </div>
    <div class="overflow-y-auto h-full px-1" :class="{'opacity-50': !serverStore.connected || keysStore.loading}">
      <Keys
        v-show="serverStore.connected"
        :keys="groupedKeys"
        :level="0"
        class="mt-2"
      />
    </div>
    <LoadMoreButton
      v-if="keysStore.cursor"
      v-show="serverStore.connected && !keysStore.loading"
      tabindex="2"
      @click="loadMore"
    />
    <div class="flex space-x-2 p-2 justify-start">
      <IconButton @click="openTwitter">
        <TwitterIcon v-tooltip="{ content: 'Follow <b>@ekvedaras</b> on twitter', html: true}" />
      </IconButton>
      <IconButton @click="openGitHub">
        <GitHubIcon v-tooltip="{ content: 'Star <b>redis-gui</b> on GitHub', html: true}" />
      </IconButton>
      <IconButton v-tooltip="'Keymap'" @click="shouldShowShortKeysModal = true">
        <span class="p-1 font-bold">
          ?
        </span>
      </IconButton>
    </div>
    <ShortKeyModal
      v-if="shouldShowShortKeysModal"
      @close="shouldShowShortKeysModal = false"
    />
    <ConfirmDialog danger :show="shouldShowDeleteSelectedDialog" @close="shouldShowDeleteSelectedDialog = false" @confirm="deleteSelectedKeys">
      Delete selected keys?
    </ConfirmDialog>
  </div>
</template>
