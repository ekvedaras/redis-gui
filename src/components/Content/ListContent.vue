<template>
  <div>
    <SearchBar v-model="search" :show-spinner="isLoading" with-add @add="showKeyAddModal"/>
    <div class="overflow-y-auto h-full pb-10 rounded overflow-x-hidden mt-4">
      <Value v-for="(item, i) in filtered"
             class="relative"
             :key="i" :value="item"
             @save="save(i, $event)"
             @delete="deleteItem({label: item, index: i}, 'keys/deleteListItem')"/>
      <LoadMoreButton @click="loadMore" v-if="start"/>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import { EventBus } from '@/services/eventBus'
import SearchBar from '@/components/Elements/SearchBar'
import Value from '@/components/Elements/Value'
import LoadMoreButton from '@/components/Elements/LoadMoreButton'
import DeletesItems from '@/components/Mixins/DeletesItems'

export default {
  name: 'ListContent',
  components: { LoadMoreButton, Value, SearchBar },
  mixins: [DeletesItems],
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
    EventBus.$on('key-updated', async name => {
      if (name !== this.name) {
        return
      }

      this.size = await redis.async('llen', this.name)
      this.start = 0
      this.loadKeys()
    })
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
    save (key, { value }) {
      redis.async('lset', this.name, key, value)
          .then(() => this.$set(this.value, key, value))
          .then(() => this.$toasted.success('Saved'))
    },
    async afterDeleteItem () {
      this.size = await redis.async('llen', this.name)
      this.start = 0
    },
  },
}
</script>

<style scoped>

</style>
