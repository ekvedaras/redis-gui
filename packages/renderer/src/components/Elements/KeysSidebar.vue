<template>
  <div class="flex flex-col">
    <SearchBar
      v-model:value="search"
      :show-spinner="isLoading"
      with-add
      :focus-keys="{main: ['/'], forced: ['ctrl', '/']}"
      :add-keys="{main: ['a'], forced: ['ctrl', 'a']}"
      class="px-2"
    />
    <div class="overflow-y-auto mt-2 h-full px-1">
      <Keys
        :keys="groupedKeys"
        :level="0"
        class="mt-2"
      />
    </div>
    <LoadMoreButton
      v-if="keysStore.cursor"
      tabindex="2"
      @click="loadMore"
    />
    <div class="flex space-x-2 p-2 justify-start">
      <IconButton @click="openTwitter">
        <TwitterIcon />
      </IconButton>
      <IconButton @click="openGitHub">
        <GitHubIcon />
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { computed, ref, watch } from 'vue'
import { useKeysStore } from '/@/store/keys'
import { useServersStore } from '/@/store/servers'
import { useToaster } from '/@/use/toaster'
import type { Keys as KeysList } from '../../../types/redis'
import IconButton from '/@/components/Elements/IconButton.vue'
import TwitterIcon from '/@/components/Icons/TwitterIcon.vue'
import GitHubIcon from '/@/components/Icons/GitHubIcon.vue'
import LoadMoreButton from '/@/components/Elements/LoadMoreButton.vue'
import { useRedis } from '/@/use/redis'
import SearchBar from '/@/components/Elements/SearchBar.vue'
import Keys from '/@/components/Elements/Keys.vue'

const serverStore = useServersStore()
const keysStore = useKeysStore()
const toaster = useToaster()
const redis = useRedis()

const search = ref('')
const isLoading = ref(false)

const openTwitter = () => window.electron.openExternal('https://twitter.com/ekvedaras')
const openGitHub = () => window.electron.openExternal('https://github.com/ekvedaras/redis-gui')

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
  let key = _.get(grouped, parentPath)

  if (!key || !Object.prototype.hasOwnProperty.call(key, 'name')) {
    return [undefined, undefined]
  }

  _.setWith(grouped, parentPath, {}, Object)
  parts = parentPath.split('.')

  let lastPart = parts.splice(-1)
  let keyPath = parts.join('.')

  _.setWith(grouped, `${ keyPath }._${ lastPart }`, key, Object)

  return [key, keyPath]
}
const groupedKeys = computed(() => {
  const grouped: KeysList = {}

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

    _.setWith(grouped, path, key, Object)

    if (nestedKey) {
      // Sort
      _.setWith(grouped, folderPath, _(_.get(grouped, folderPath)).toPairs().sortBy(0).fromPairs().value(), Object)
    }
  })

  return grouped
})
</script>

<style scoped>

</style>
