<template>
  <div class="flex flex-col">
    <SearchBar v-model="search" :show-spinner="isLoading" with-add @add="showKeyAddModal" class="px-2"/>
    <div class="overflow-y-auto mt-2 h-full px-1">
      <Keys :keys="groupedKeys" :level="0" class="mt-2"/>
    </div>
    <button @click="loadMore" v-if="cursor" tabindex="2" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import SearchBar from '@/components/Elements/SearchBar'

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
  components: { SearchBar },
  data: () => ({
    search: '',
    isLoading: false,
  }),
  watch: {
    search () {
      this.isLoading = true
      let wildcard = this.search.indexOf('*') > -1 ? '' : '*'
      this.loadKeys({ pattern: `${wildcard}${this.search}${wildcard}` }).finally(() => this.isLoading = false)
    },
  },
  mounted () {
    this.isLoading = true
    this.loadKeys().finally(() => this.isLoading = false)
  },
  methods: {
    ...mapActions('keys', ['loadKeys']),
    loadMore () {
      this.isLoading = true
      let wildcard = this.search.indexOf('*') > -1 ? '' : '*'
      this.loadKeys({ pattern: `${wildcard}${this.search}${wildcard}`, cursor: this.cursor }).finally(() => this.isLoading = false)
    },
    showKeyAddModal () {
      this.$modal.show(AddKeyModal)
    },
  },
  computed: {
    ...mapState('keys', ['list', 'cursor']),
    groupedKeys () {
      let grouped = {}

      Object.entries(this.list).forEach(([name, key]) => {
        if (name.indexOf(':') < 0) {
          grouped[name] = key
          return true
        }

        let path = name.replace(/:/g, '.')

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
