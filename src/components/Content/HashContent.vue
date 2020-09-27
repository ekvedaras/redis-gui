<template>
  <div class="p-4 pb-10">
    <div class="flex justify-center space-x-2 mb-2">
      <div class="relative flex flex-1 items-center">
        <!--suppress HtmlFormInputWithoutLabel -->
        <input type="text" placeholder="Search keys..." v-model="search" class="py-2 px-3 rounded shadow w-full"/>
        <Spinner :class="[isLoading ? 'opacity-100' : 'opacity-0']"/>
      </div>
      <div class="h-full hover:bg-red-200 rounded" @click="showKeyAddModal">
        <AddIcon class="text-gray-600 w-10 h-full hover:text-redis"/>
      </div>
    </div>
    <div class="overflow-y-auto h-full pb-10 rounded">
      <div v-for="(item, key) in value" :key="key" class="relative">
        <div v-if="!isEditing[key]" class="sticky top-0 font-bold z-10 bg-gray-100">{{ key }}</div>
        <input type="text" v-if="isEditing[key]" v-model="editKey" @keydown.esc="close(key)" @keydown.ctrl.enter="save(key)" class="p-1 shadow rounded"/>
        <button type="button" @click="editItem(item, key)" class="absolute top-0 right-0 mr-6 z-10">
          <EditIcon class="w-5 cursor-pointer text-gray-500 hover:text-redis"/>
        </button>
        <button type="button" @click="deleteItem(item)" class="absolute top-0 right-0 z-10">
          <DeleteIcon class="w-5 cursor-pointer text-gray-500 hover:text-redis"/>
        </button>
        <div v-if="!isEditing[key]">
          <ValueRenderer :value="item" class="mb-4"/>
        </div>
        <div v-if="isEditing[key]">
          <textarea class="p-2 w-full shadow h-64" :ref="`editor_${key}`" v-model="editValue" @keydown.esc="close(key)" @keydown.ctrl.enter="save(key)"/>
          <span class="text-xs text-gray-500">CTRL + Enter to save, Esc to cancel</span>
        </div>
      </div>
      <button @click="loadMore" v-if="nextCursor" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import Spinner from '@/components/Elements/Spinner'
import _ from 'lodash'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import AddIcon from '@/components/Icons/AddIcon'
import { EventBus } from '@/services/eventBus'
import DeleteIcon from '@/components/Icons/DeleteIcon'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import EditIcon from '@/components/Icons/EditIcon'

export default {
  name: 'HashContent',
  components: { EditIcon, ValueRenderer, DeleteIcon, AddIcon, Spinner },
  props: ['name'],
  data: () => ({
    value: '',
    search: '',
    isLoading: true,
    isEditing: [],
    nextCursor: 0,
    editValue: '',
    editKey: '',
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
      return redis.async('hscan', this.name, cursor, 'MATCH', pattern, 'COUNT', limit).then(result => {
        result.lastLoad = Object.keys(result[1]).length
        this.nextCursor = parseInt(result[0])

        let value = _.fromPairs(_.chunk(result[1], 2))
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
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'hash' } })
    },
    editItem (value, key) {
      this.editValue = value
      this.editKey = key
      this.$set(this.isEditing, key, true)
      this.$nextTick(() => this.$refs[`editor_${key}`][0].focus())
    },
    save (key) {
      (key === this.editKey ? Promise.resolve() : redis.async('hdel', this.name, key))
          .then(() => redis.async('hset', this.name, this.editKey, this.editValue)
              .then(() => this.$toasted.success('Saved'))
              .then(() => this.loadKeys()))
          .finally(() => this.close(key))
    },
    close (key) {
      this.$set(this.isEditing, key, false)
    },
    deleteItem (key) {
      this.$modal.show('dialog', {
        title: 'Confirm',
        text: `Are you sure you want to delete <b>${key}</b> item from ${this.name}?`,
        buttons: [
          {
            title: 'Cancel',
            handler: () => this.$modal.hide('dialog'),
          },
          {
            title: 'Confirm',
            handler: () => {
              this.$store.dispatch('deleteHashItem', { keyName: this.name, key }).then(async () => {
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
