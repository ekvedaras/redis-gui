<template>
  <div class="p-4 pb-10">
    <div class="flex justify-center space-x-2 mb-2">
      <div class="relative flex flex-1 items-center">
        <!--suppress HtmlFormInputWithoutLabel -->
        <input type="text" placeholder="Search... (client side, regex)" v-model="search" class="py-2 px-3 rounded shadow w-full"/>
        <Spinner :class="[isLoading ? 'opacity-100' : 'opacity-0']"/>
      </div>
      <div class="h-full hover:bg-red-200 rounded" @click="showKeyAddModal">
        <AddIcon class="text-gray-600 w-10 h-full hover:text-redis"/>
      </div>
    </div>
    <div class="overflow-y-auto h-full pb-10 rounded overflow-x-hidden">
      <ValueRenderer v-for="(item, i) in filtered" :key="i" :value="item" class="mb-4"/>
      <button @click="loadMore" v-if="start" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import Spinner from '@/components/Elements/Spinner'
import AddIcon from '@/components/Icons/AddIcon'
import AddKeyModal from '@/components/Modals/AddKeyModal'

export default {
  name: 'ListContent',
  components: { AddIcon, Spinner, ValueRenderer },
  props: ['name'],
  data: () => ({
    value: [],
    size: 0,
    start: 0,
    isLoading: true,
    search: '',
  }),
  computed: {
    filtered () {
      if (!this.search.length) {
        return this.value
      }

      let pattern = new RegExp(this.search, 'i')
      return this.value.filter(item => pattern.test(item))
    },
  },
  async mounted () {
    this.size = await redis.async('llen', this.name)
    this.loadKeys()
  },
  methods: {
    loadKeys ({ start = 0, limit = Math.min(this.size - this.start, redis.pageSize) } = {}) {
      this.isLoading = true
      return redis.async('lrange', this.name, start, start + limit - 1).then(result => {
        if (start + result.length < this.size) {
          this.start = start + result.length
        } else {
          this.start = 0
        }

        if (start) {
          result.forEach(item => this.value.push(item))
        } else {
          this.value = result
        }
      }).finally(() => this.isLoading = false)
    },
    loadMore () {
      this.loadKeys({ start: this.start })
    },
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'list' } })
    },
  },
}
</script>

<style scoped>

</style>
