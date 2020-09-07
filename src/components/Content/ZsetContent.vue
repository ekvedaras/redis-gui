<template>
  <div class="p-4 pb-10">
    <div class="relative flex items-center mb-2">
      <!--suppress HtmlFormInputWithoutLabel -->
      <input type="text" placeholder="Search..." v-model="search" class="py-2 px-3 rounded shadow w-full"/>
      <Spinner :class="[isLoading ? 'opacity-100' : 'opacity-0']"/>
    </div>
    <div class="overflow-y-auto h-full pb-10 rounded overflow-x-hidden">
      <div v-for="(item, score) in value" :key="score">
        <div class="sticky top-0 font-bold z-10 bg-gray-100">{{ score }}</div>
        <ValueRenderer :value="item" class="mb-4"/>
      </div>
      <button @click="loadMore" v-if="nextCursor" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import Spinner from '@/components/Elements/Spinner'

export default {
  name: 'ZsetContent',
  components: { Spinner, ValueRenderer },
  props: ['name'],
  data: () => ({
    value: [],
    search: '',
    isLoading: true,
    nextCursor: 0,
  }),
  async mounted () {
    await this.loadKeys()
  },
  watch: {
    search () {
      let wildcard = this.search.indexOf('*') > -1 ? '' : '*'
      this.loadKeys({ pattern: `${wildcard}${this.search}${wildcard}` })
    },
  },
  methods: {
    loadKeys ({ pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0 } = {}) {
      this.isLoading = true
      return redis.async('zscan', this.name, cursor, 'MATCH', pattern, 'COUNT', limit).then(result => {
        result.lastLoad = Object.keys(result[1]).length

        this.nextCursor = parseInt(result[0])

        let value = _.fromPairs(_.chunk(result[1], 2).map(chunk => _.reverse(chunk)))
        this.value = cursor ? { ...this.value, ...value } : value

        return result
      }).then(result => {
        if (result.nextCursor && lastLoad + result.lastLoad < limit) {
          return this.loadKeys({ pattern, cursor: result.nextCursor, limit, lastLoad: lastLoad + Object.keys(result[1]).length })
        }

        return result
      }).finally(() => this.isLoading = false)
    },
    loadMore () {
      this.loadKeys({ pattern: `*${this.search}*`, cursor: this.nextCursor })
    },
  },
}
</script>

<style scoped>

</style>
