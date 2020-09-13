<template>
  <div class="p-4">
    <div class="flex justify-center space-x-2 mb-2">
      <div class="relative flex flex-1 items-center">
        <!--suppress HtmlFormInputWithoutLabel -->
        <input type="text" placeholder="Search..." v-model="search" class="py-2 px-3 rounded shadow w-full"/>
        <Spinner :class="[isLoading ? 'opacity-100' : 'opacity-0']"/>
      </div>
      <div class="h-full hover:bg-red-200 rounded" @click="showKeyAddModal">
        <AddIcon class="text-gray-600 w-10 h-full hover:text-redis"/>
      </div>
    </div>
    <div class="overflow-y-auto h-full pb-10 rounded overflow-x-hidden">
      <div v-for="(item, i) in value" :key="i" class="relative">
        <button type="button" @click="deleteItem(item)" class="absolute top-0 right-0 mt-2 mr-2 z-10">
          <DeleteIcon class="w-5 cursor-pointer text-gray-500 hover:text-redis"/>
        </button>
        <ValueRenderer :value="item" class="mb-4"/>
      </div>
      <button @click="loadMore" v-if="nextCursor" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import Spinner from '@/components/Elements/Spinner'
import AddIcon from '@/components/Icons/AddIcon'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import { EventBus } from '@/services/eventBus'
import DeleteIcon from '@/components/Icons/DeleteIcon'

export default {
  name: 'SetContent',
  components: { DeleteIcon, AddIcon, Spinner, ValueRenderer },
  props: ['name'],
  data: () => ({
    value: [],
    search: '',
    isLoading: true,
    nextCursor: 0,
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
  watch: {
    search () {
      let wildcard = this.search.indexOf('*') > -1 ? '' : '*'
      this.loadKeys({ pattern: `${wildcard}${this.search}${wildcard}` })
    },
  },
  methods: {
    loadKeys ({ pattern = '*', cursor = 0, limit = redis.pageSize, lastLoad = 0 } = {}) {
      this.isLoading = true
      return redis.async('sscan', this.name, cursor, 'MATCH', pattern, 'COUNT', limit).then(result => {
        result.lastLoad = Object.keys(result[1]).length

        this.nextCursor = parseInt(result[0])

        this.value = cursor ? { ...this.value, ...result[1] } : result[1]

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
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'set' } })
    },
    deleteItem (value) {
      this.$modal.show('dialog', {
        title: 'Confirm',
        text: `Are you sure you want to delete <b>${value.substr(0, 50)}</b> item from ${this.name}?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => this.$modal.hide('dialog'),
          },
          {
            title: 'Confirm',
            handler: () => {
              this.$store.dispatch('deleteSetItem', { keyName: this.name, value }).then(async () => {
                this.loadKeys()
              })
              this.$modal.hide('dialog')
            },
          },
        ],
      })
    },
  },
}
</script>

<style scoped>

</style>
