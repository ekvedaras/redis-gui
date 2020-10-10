<template>
  <div class="flex flex-col">
    <div class="px-2 flex items-center space-x-2">
      <div class="relative flex items-center">
        <!--suppress HtmlFormInputWithoutLabel -->
        <input type="text" placeholder="Search..." v-model="search" class="py-2 px-3 rounded shadow w-full"/>
        <Spinner :class="[isLoading ? 'opacity-100' : 'opacity-0']"/>
      </div>
      <div class="h-full hover:bg-red-200 rounded" @click="showKeyAddModal">
        <AddIcon class="text-gray-600 w-10 h-full hover:text-redis"/>
      </div>
    </div>
    <div class="overflow-y-auto mt-2 h-full px-1">
      <Keys :keys="groupedKeys" :level="0" class="mt-2"/>
    </div>
    <button @click="loadMore" v-if="cursor" tabindex="2" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'
import Spinner from '@/components/Elements/Spinner'
import AddIcon from '@/components/Icons/AddIcon'
import AddKeyModal from '@/components/Modals/AddKeyModal'

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
  components: { AddIcon, Spinner },
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
