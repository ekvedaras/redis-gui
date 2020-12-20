<template>
  <div class="flex flex-col">
    <SearchBar v-model="search"
               :show-spinner="isLoading"
               with-add
               @add="showKeyAddModal"
               :focus-keys="{main: ['/'], forced: ['ctrl', '/']}"
               :add-keys="{main: ['a'], forced: ['ctrl', 'a']}"
               class="px-2"/>
    <div class="overflow-y-auto mt-2 h-full px-1">
      <Keys :keys="groupedKeys" :level="0" class="mt-2"/>
    </div>
    <LoadMoreButton @click="loadMore" v-if="cursor" tabindex="2"/>
    <div class="flex space-x-2 p-2 justify-start">
      <IconButton @click="openTwitter">
        <TwitterIcon v-tooltip="'Follow <b>@ekvedaras</b> on twitter'"/>
      </IconButton>
      <IconButton @click="openGitHub">
        <GitHubIcon v-tooltip="'Star <b>redis-gui</b> on GitHub'"/>
      </IconButton>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import SearchBar from '@/components/Elements/SearchBar'
import LoadMoreButton from '@/components/Elements/LoadMoreButton'
import { redis } from '@/services/redis'
import IconButton from '@/components/Elements/IconButton'
import TwitterIcon from '@/components/Icons/TwitterIcon'
import GitHubIcon from '@/components/Icons/GitHubIcon'
import { shell } from 'electron'

let nestKey = (grouped, path) => {
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

  _.setWith(grouped, `${keyPath}._${lastPart}`, key, Object)

  return [key, keyPath]
}

export default {
  name: 'KeysSidebar',
  components: { GitHubIcon, TwitterIcon, IconButton, LoadMoreButton, SearchBar },
  data: () => ({
    search: '',
    isLoading: false,
  }),
  watch: {
    search () {
      this.isLoading = true
      let wildcard = this.search.indexOf('*') > -1 ? '' : '*'
      this.loadKeys({ pattern: `${wildcard}${this.search}${wildcard}` })
          .then(result => this.isLoading = result.wasCancelled)
          .catch(() => this.isLoading = false)
    },
    selected () {
      this.isLoading = true
      let wildcard = this.search.indexOf('*') > -1 ? '' : '*'
      this.loadKeys({ pattern: `${wildcard}${this.search}${wildcard}` })
          .then(result => this.isLoading = result.wasCancelled)
          .catch(() => this.isLoading = false)
    },
  },
  mounted () {
    this.isLoading = true
    this.loadKeys()
        .then(result => this.isLoading = result.wasCancelled)
        .catch(() => this.isLoading = false)
  },
  methods: {
    ...mapActions('keys', ['loadKeys']),
    loadMore () {
      this.isLoading = true
      let wildcard = this.search.indexOf('*') > -1 ? '' : '*'
      this.loadKeys({ pattern: `${wildcard}${this.search}${wildcard}`, cursor: this.cursor })
          .then(result => {
            this.isLoading = result.wasCancelled
            this.$toasted.info(`${result.loaded} keys loaded`)
          })
          .catch(() => this.isLoading = false)
    },
    showKeyAddModal () {
      this.$modal.show(AddKeyModal)
    },
    openTwitter () {
      shell.openExternal('https://twitter.com/ekvedaras')
    },
    openGitHub () {
      shell.openExternal('https://github.com/ekvedaras/redis-gui')
    },
  },
  computed: {
    ...mapState('servers', ['selected']),
    ...mapState('keys', ['list', 'cursor']),
    groupedKeys () {
      let grouped = {}

      Object.entries(this.list).forEach(([name, key]) => {
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
          _.setWith(grouped, folderPath, _.sortKeysBy(_.get(grouped, folderPath)), Object)
        }
      })

      return grouped
    },
  },
}
</script>

<style scoped>

</style>
