<template>
  <div class="flex flex-col">
    <div class="relative px-2 flex items-center">
      <!--suppress HtmlFormInputWithoutLabel -->
      <input type="text" placeholder="Search..." v-model="search" class="p-2 rounded shadow w-full"/>
      <Spinner :class="[isLoading ? 'opacity-100' : 'opacity-0']"/>
    </div>
    <Keys :keys="groupedKeys" :level="0"/>
    <button @click="loadMore" v-if="nextKeysCursor" tabindex="2" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'
import Spinner from '@/components/Elements/Spinner'

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
  components: { Spinner },
  data: () => ({
    search: '',
    isLoading: false,
  }),
  watch: {
    search () {
      this.isLoading = true
      this.loadKeys({ pattern: `*${this.search}*` }).finally(() => this.isLoading = false)
    },
  },
  mounted () {
    this.isLoading = true
    this.loadKeys().finally(() => this.isLoading = false)
  },
  methods: {
    ...mapActions(['loadKeys']),
    loadMore () {
      this.isLoading = true
      this.loadKeys({ pattern: `*${this.search}*`, cursor: this.nextKeysCursor }).finally(() => this.isLoading = false)
    },
  },
  computed: {
    ...mapState(['keys', 'nextKeysCursor']),
    groupedKeys () {
      let grouped = {}

      Object.entries(this.keys).forEach(([name, key]) => {
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
