<template>
  <div>
    <SearchBar v-model="search"
               :show-spinner="isLoading"
               with-add :add-name="name" add-type="set"/>
    <div class="overflow-y-auto h-full rounded overflow-x-hidden mt-4">
      <Value v-for="(item, i) in value"
             class="relative"
             :key="i" :value="item"
             @save="save(i, $event)"
             @delete="deleteItem(item, 'keys/deleteSetItem')"/>
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
import DeletesItems from '@/components/Mixins/DeletesItems'
import ReloadsOnKeyUpdate from '@/components/Mixins/ReloadsOnKeyUpdate'
import CountsItems from '@/components/Mixins/CountsItems'
import CenteredLoader from '@/components/Elements/CenteredLoader'

export default {
  name: 'SetContent',
  components: { CenteredLoader, LoadMoreButton, Value, SearchBar },
  mixins: [ScansKey, DeletesItems, ReloadsOnKeyUpdate, CountsItems],
  props: ['name'],
  data: () => ({
    value: [],
    scanUsing: 'sscan',
  }),
  methods: {
    setScannedValue (value, merge) {
      this.value = merge ? { ...this.value, ...value } : value
    },
    async save (key, { value }) {
      (await redis.multi([
        ['srem', this.name, this.value[key]],
        ['sadd', this.name, value],
      ])).exec(error => {
        if (!error) {
          this.$set(this.value, key, value)
          this.$toasted.success('Saved')
          this.loadKeys()
        } else {
          this.$toasted.error(error)
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
