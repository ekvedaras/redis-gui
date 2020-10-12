<template>
  <div>
    <SearchBar v-model="search" :show-spinner="isLoading" with-add @add="showKeyAddModal"/>
    <div class="overflow-y-auto h-full pb-10 rounded mt-4">
      <Value v-for="(item, key) in value"
             class="relative"
             :key="key" :value="item" :item-key="key"
             @save="save(key, $event)"
             @delete="deleteItem(key, 'keys/deleteHashItem')"/>
      <LoadMoreButton @click="loadMore" v-if="nextCursor"/>
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
import ScansKey from '@/components/Mixins/ScansKey'
import _ from 'lodash'
import DeletesItems from '@/components/Mixins/DeletesItems'

export default {
  name: 'HashContent',
  components: { LoadMoreButton, Value, SearchBar },
  mixins: [ScansKey, DeletesItems],
  props: ['name'],
  data: () => ({
    value: '',
    scanUsing: 'hscan',
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
      let parsed = _.fromPairs(_.chunk(value, 2))
      this.value = merge ? { ...this.value, ...parsed } : parsed
    },
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'hash' } })
    },
    save (key, { key: newKey, value }) {
      (key === newKey ? Promise.resolve() : redis.async('hdel', this.name, key))
          .then(() => redis.async('hset', this.name, newKey, value)
              .then(() => this.$toasted.success('Saved'))
              .then(() => this.loadKeys()))
    },
  },
}
</script>

<style scoped>

</style>
