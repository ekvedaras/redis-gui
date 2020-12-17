<template>
  <div>
    <SearchBar v-model="search"
               :show-spinner="isLoading"
               with-add :add-name="name" add-type="hash"/>
    <div class="overflow-y-auto h-full rounded mt-4">
      <Value v-for="(item, key) in value"
             class="relative"
             :key="key" :value="item" :item-key="key"
             @save="save(key, $event)"
             @delete="deleteItem(key, 'keys/deleteHashItem')"/>
      <LoadMoreButton @click="loadMore" v-if="nextCursor"/>
      <CenteredLoader v-if="isLoading && !hasItems"/>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import SearchBar from '@/components/Elements/SearchBar'
import Value from '@/components/Elements/Value'
import LoadMoreButton from '@/components/Elements/LoadMoreButton'
import ScansKey from '@/components/Mixins/ScansKey'
import _ from 'lodash'
import DeletesItems from '@/components/Mixins/DeletesItems'
import ReloadsOnKeyUpdate from '@/components/Mixins/ReloadsOnKeyUpdate'
import CountsItems from '@/components/Mixins/CountsItems'
import CenteredLoader from '@/components/Elements/CenteredLoader'

export default {
  name: 'HashContent',
  components: { CenteredLoader, LoadMoreButton, Value, SearchBar },
  mixins: [ScansKey, DeletesItems, ReloadsOnKeyUpdate, CountsItems],
  props: ['name'],
  data: () => ({
    value: '',
    scanUsing: 'hscan',
  }),
  methods: {
    setScannedValue (value, merge) {
      let parsed = _.fromPairs(_.chunk(value, 2))
      this.value = merge ? { ...this.value, ...parsed } : parsed
    },
    async save (key, { key: newKey, value }) {
      let commands = []
      if (key !== newKey) {
        commands.push(['hdel', this.name, key])
      }

      commands.push(['hset', this.name, newKey, value]);

      (await redis.multi(commands)).exec(error => {
        if (!error) {
          this.$toasted.success('Saved')
          this.loadKeys()
        } else {
          this.$toasted.error(error)
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
