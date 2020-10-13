<template>
  <div>
    <SearchBar v-model="search"
               :show-spinner="isLoading"
               with-add :add-name="name" add-type="set"/>
    <div class="overflow-y-auto h-full pb-10 rounded overflow-x-hidden mt-4">
      <Value v-for="(item, i) in value"
             class="relative"
             :key="i" :value="item"
             @save="save(i, $event)"
             @delete="deleteItem(item, 'keys/deleteSetItem')"/>
      <LoadMoreButton @click="loadMore" v-if="nextCursor"/>
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

export default {
  name: 'SetContent',
  components: { LoadMoreButton, Value, SearchBar },
  mixins: [ScansKey, DeletesItems, ReloadsOnKeyUpdate],
  props: ['name'],
  data: () => ({
    value: [],
    scanUsing: 'sscan',
  }),
  methods: {
    setScannedValue (value, merge) {
      this.value = merge ? { ...this.value, ...value } : value
    },
    save (key, { value }) {
      redis.async('srem', this.name, this.value[key]).then(
          () => redis.async('sadd', this.name, value)
              .then(() => this.$set(this.value, key, value))
              .then(() => this.$toasted.success('Saved'))
              .then(() => this.loadKeys()),
      )
    },
  },
}
</script>

<style scoped>

</style>
