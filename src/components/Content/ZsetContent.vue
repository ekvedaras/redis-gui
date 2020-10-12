<template>
  <div>
    <SearchBar v-model="search" :show-spinner="isLoading" with-add @add="showKeyAddModal"/>
    <div class="overflow-y-auto h-full pb-10 rounded mt-4">
      <Value v-for="(item, score) in value"
             class="relative"
             :key="score" :value="item" :item-key="score"
             @save="save"
             @delete="deleteItem(item, 'keys/deleteZsetItem')"/>
      <LoadMoreButton @click="loadMore" v-if="nextCursor"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { redis } from '@/services/redis'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import { EventBus } from '@/services/eventBus'
import SearchBar from '@/components/Elements/SearchBar'
import Value from '@/components/Elements/Value'
import LoadMoreButton from '@/components/Elements/LoadMoreButton'
import ScansKey from '@/components/Mixins/ScansKey'
import DeletesItems from '@/components/Mixins/DeletesItems'

export default {
  name: 'ZsetContent',
  components: { LoadMoreButton, Value, SearchBar },
  mixins: [ScansKey, DeletesItems],
  props: ['name'],
  data: () => ({
    value: [],
    scanUsing: 'zscan',
  }),
  async mounted () {
    await this.loadKeys()
    EventBus.$on('key-updated', async name => {
      if (name !== this.name) {
        return
      }

      this.loadKeys()
    })
  },
  methods: {
    setScannedValue (value, merge) {
      let parsed = _.fromPairs(_.chunk(value, 2).map(chunk => _.reverse(chunk)))
      this.value = merge ? { ...this.value, ...parsed } : parsed
    },
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'zset' } })
    },
    save ({ key, value }) {
      redis.async('zadd', this.name, key, value)
          .then(() => this.$toasted.success('Saved'))
          .then(() => this.loadKeys())
    },
  },
}
</script>

<style scoped>

</style>
