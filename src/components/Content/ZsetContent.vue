<template>
  <div>
    <SearchBar v-model="search"
               :show-spinner="isLoading"
               with-add :add-name="name" add-type="zset"/>
    <div class="overflow-y-auto h-full rounded mt-4">
      <Value v-for="(score, item) in value"
             class="relative"
             :key="item" :value="item" :item-key="score"
             @save="save"
             @delete="deleteItem(item, 'keys/deleteZsetItem')"/>
      <LoadMoreButton @click="loadMore" v-if="nextCursor"/>
      <CenteredLoader v-if="isLoading && !hasItems"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { redis } from '@/services/redis'
import SearchBar from '@/components/Elements/SearchBar'
import Value from '@/components/Elements/Value'
import LoadMoreButton from '@/components/Elements/LoadMoreButton'
import ScansKey from '@/components/Mixins/ScansKey'
import DeletesItems from '@/components/Mixins/DeletesItems'
import ReloadsOnKeyUpdate from '@/components/Mixins/ReloadsOnKeyUpdate'
import CountsItems from '@/components/Mixins/CountsItems'
import CenteredLoader from '@/components/Elements/CenteredLoader'

export default {
  name: 'ZsetContent',
  components: { CenteredLoader, LoadMoreButton, Value, SearchBar },
  mixins: [ScansKey, DeletesItems, ReloadsOnKeyUpdate, CountsItems],
  props: ['name'],
  data: () => ({
    value: [],
    scanUsing: 'zscan',
  }),
  methods: {
    setScannedValue (value, merge) {
      let parsed = _.fromPairs(_.chunk(value, 2))
      this.value = merge ? { ...this.value, ...parsed } : parsed
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
