<template>
  <Modal title="Add new key">
    <div class="flex space-x-4">
      <input type="text" placeholder="Name" v-model="name" class="flex-1"/>
      <input type="text" placeholder="Hash key name" v-if="type === 'hash'" v-model="hashName" class="flex-1"/>
      <input type="number" placeholder="Index" v-if="type === 'list'" v-model="index" class="flex-1"/>
      <input type="number" placeholder="Score" v-if="type === 'zset'" v-model="score" class="flex-1"/>
      <select v-model="type">
        <option value="string">string</option>
        <option value="hash">hash</option>
        <option value="list">list</option>
        <option value="set">set</option>
        <option value="zset">zset</option>
      </select>
    </div>
    <textarea v-for="(value, index) in values" :key="index" class="flex-1" placeholder="Value" v-model="values[index]"/>
    <div class="flex justify-end space-x-4">
      <Button v-if="['list', 'set'].indexOf(type) > -1" @click="values.push('')">Add</Button>
      <input type="number" class="w-20" v-if="type === 'string'" placeholder="TTL" v-model="ttl"/>
      <PrimaryButton @click="save">Save</PrimaryButton>
    </div>
  </Modal>
</template>

<script>
import { redis } from '@/services/redis'
import { EventBus } from '@/services/eventBus'
import { mapActions, mapMutations } from 'vuex'
import Modal from '@/components/Modals/Modal'
import Button from '@/components/Elements/Button'
import PrimaryButton from '@/components/Elements/PrimaryButton'

export default {
  name: 'AddKeyModal',
  components: { PrimaryButton, Button, Modal },
  props: {
    fill: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    name: '',
    hashName: '',
    score: 0,
    index: '',
    type: 'string',
    ttl: '',
    values: [''],
  }),
  mounted () {
    Object.entries(this.fill).forEach(([name, value]) => {
      this[name] = value
    })
  },
  methods: {
    ...mapMutations('keys', ['select', 'refreshTTL']),
    ...mapActions('keys', ['loadKeys']),
    save () {
      (() => {
        let params = [this.name]
        switch (this.type) {
          case 'string':
            params.push(...this.values)
            if (this.ttl > 0) {
              params.push('EX', this.ttl)
            }
            return redis.async('set', ...params)
          case 'hash':
            params.push(this.hashName, ...this.values)
            return redis.async('hset', ...params)
          case 'list':
            if (this.index !== '') {
              params.push(this.index)
            }
            params.push(...this.values)
            return redis.async(this.index !== '' ? 'lset' : 'lpush', ...params)
          case 'set':
            params.push(...this.values)
            return redis.async('sadd', ...params)
          case 'zset':
            params.push(this.score, ...this.values)
            return redis.async('zadd', ...params)
        }
      })().then(() => {
        this.$emit('close')
        this.$toasted.success(`Key ${this.name} added`)
        this.loadKeys().then(() => {
          this.select(this.name)
          this.refreshTTL()
          EventBus.$emit('key-updated', this.name)
        })
      })
    },
  },
}
</script>

<style scoped>

</style>
