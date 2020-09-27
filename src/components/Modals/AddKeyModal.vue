<template>
  <div class="bg-gray-200 p-4 flex flex-col space-y-4">
    <h2 class="text-lg">Add new key</h2>
    <div class="flex space-x-4">
      <input type="text" placeholder="Name" v-model="name" class="p-2 rounded shadow flex-1"/>
      <input type="text" placeholder="Hash key name" v-if="type === 'hash'" v-model="hashName" class="p-2 rounded shadow flex-1"/>
      <input type="number" placeholder="Index" v-if="type === 'list'" v-model="index" class="p-2 rounded shadow flex-1"/>
      <input type="number" placeholder="Score" v-if="type === 'zset'" v-model="score" class="p-2 rounded shadow flex-1"/>
      <select class="p-2 rounded shadow" v-model="type">
        <option value="string">string</option>
        <option value="hash">hash</option>
        <option value="list">list</option>
        <option value="set">set</option>
        <option value="zset">zset</option>
      </select>
    </div>
    <textarea v-for="(value, index) in values" :key="index" class="p-2 rounded shadow flex-1" placeholder="Value" v-model="values[index]"/>
    <div class="flex justify-end space-x-4">
      <button v-if="['list', 'set'].indexOf(type) > -1" @click="values.push('')" class="transition transition-colors duration-100 ease-in-out p-2 bg-red-700 text-white rounded shadow hover:shadow-md hover:bg-redis">Add</button>
      <input type="number" class="p-2 rounded shadow w-20" v-if="type === 'string'" placeholder="TTL" v-model="ttl"/>
      <button @click="save" class="transition transition-colors duration-100 ease-in-out p-2 bg-red-700 text-white rounded shadow hover:shadow-md hover:bg-redis">Save</button>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import { EventBus } from '@/services/eventBus'

export default {
  name: 'AddKeyModal',
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
        this.$store.dispatch('loadKeys').then(() => {
          this.$store.commit('select', this.name)
          this.$store.commit('refreshTTL')
          EventBus.$emit('key-updated', this.name)
        })
      })
    },
  },
}
</script>

<style scoped>

</style>