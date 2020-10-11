<template>
  <div class="p-4 pb-10">
    <SearchBar v-model="search" :show-spinner="isLoading" with-add @add="showKeyAddModal"/>
    <div class="overflow-y-auto h-full pb-10 rounded mt-2">
      <div v-for="(item, score) in value" :key="score" class="relative">
        <div v-if="!isEditing[score]" class="sticky top-0 font-bold z-10 bg-gray-100">{{ score }}</div>
        <input type="number" v-if="isEditing[score]" v-model="editScore" @keydown.esc="close(score)" @keydown.ctrl.enter="save(score)" class="p-1 shadow rounded"/>
        <Button @click="editItem(item, score)" class="absolute top-0 right-0 mr-6 z-10">
          <EditIcon class="w-4 m-1"/>
        </Button>
        <Button @click="deleteItem(item)" class="absolute top-0 right-0 z-10">
          <DeleteIcon class="w-4 m-1"/>
        </Button>
        <div v-if="!isEditing[score]">
          <ValueRenderer :value="item" class="mb-4"/>
        </div>
        <div v-if="isEditing[score]">
          <textarea class="p-2 w-full shadow h-64" :ref="`editor_${score}`" v-model="editValue" @keydown.esc="close(score)" @keydown.ctrl.enter="save(score)"/>
          <span class="text-xs text-gray-500">CTRL + Enter to save, Esc to cancel</span>
        </div>
      </div>
      <button @click="loadMore" v-if="nextCursor" class="underline rounded transition duration-200 ease-in-out hover:bg-white hover:shadow hover:no-underline m-2 p-1">Load more...</button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'
import AddKeyModal from '@/components/Modals/AddKeyModal'
import { EventBus } from '@/services/eventBus'
import DeleteIcon from '@/components/Icons/DeleteIcon'
import EditIcon from '@/components/Icons/EditIcon'
import Button from '@/components/Elements/Button'
import SearchBar from '@/components/Elements/SearchBar'

export default {
  name: 'ZsetContent',
  components: { SearchBar, Button, EditIcon, DeleteIcon, ValueRenderer },
  props: ['name'],
  data: () => ({
    value: [],
    search: '',
    isLoading: true,
    isEditing: {},
    nextCursor: 0,
    editValue: '',
    editScore: 0,
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
    showKeyAddModal () {
      this.$modal.show(AddKeyModal, { fill: { name: this.name, type: 'zset' } })
    },
    editItem (value, score) {
      this.editValue = value
      this.editScore = score
      this.$set(this.isEditing, score, true)
      this.$nextTick(() => this.$refs[`editor_${score}`][0].focus())
    },
    save (score) {
      redis.async('zadd', this.name, this.editScore, this.editValue)
          .then(() => this.$toasted.success('Saved'))
          .then(() => this.loadKeys())
          .finally(() => this.close(score))
    },
    close (score) {
      this.$set(this.isEditing, score, false)
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
              this.$store.dispatch('keys/deleteZsetItem', { keyName: this.name, value }).then(async () => {
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
