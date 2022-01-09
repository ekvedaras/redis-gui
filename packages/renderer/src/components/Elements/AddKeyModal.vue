<template>
  <AppModal :show="show" @update:show="emit('update:show', $event)" title="Add new key">
    <div class="flex space-x-4">
      <input type="text" placeholder="Name" v-model="name" class="flex-1" />
      <input type="text" placeholder="Hash key name" v-if="type === 'hash'" v-model="hashName" class="flex-1" />
      <input type="number" placeholder="Index" v-if="type === 'list'" v-model="index" class="flex-1" />
      <input type="number" placeholder="Score" v-if="type === 'zset'" v-model="score" class="flex-1" />
      <select v-model="type">
        <option value="string">string</option>
        <option value="hash">hash</option>
        <option value="list">list</option>
        <option value="set">set</option>
        <option value="zset">zset</option>
      </select>
    </div>
    <textarea v-for="(value, index) in values" :key="index" class="flex-1" placeholder="Value" v-model="values[index]" />
    <div class="flex justify-end space-x-4">
      <Button v-if="['list', 'set'].indexOf(type) > -1" @click="values.push('')">Add</Button>
      <input type="number" class="w-20" v-if="type === 'string'" placeholder="TTL" v-model="ttl" />
      <Button @click="emit('update:show', false)">Cancel</Button>
      <PrimaryButton @click="save">Save</PrimaryButton>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { onMounted, ref, toRef, watch } from 'vue'
import AppModal from '/@/components/Elements/AppModal.vue'
import Button from '/@/components/Elements/Button.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'
import { StringArray } from '../../../types/models'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import { useKeysStore } from '/@/store/keys'
import useEmitter from '/@/use/emitter'

const props = withDefaults(defineProps<{
  show: boolean;
  fill?: StringArray;
}>(), {
  fill: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void;
}>()

const name = ref('')
const hashName = ref('')
const score = ref(0)
const index = ref('')
const type = ref<'string' | 'list' | 'set' | 'zset' | 'hash'>('string')
const ttl = ref(0)
const values = ref([''])
const fill = toRef(props, 'fill')

onMounted(() => Object.entries(props.fill).forEach(([name, value]) => {
  fill.value[name] = value
}))

watch(() => type.value, (newType) => {
  if (!['list', 'set'].includes(newType)) {
    values.value.splice(1, values.value.length - 1)
  }
})

const redis = useRedis()
const toaster = useToaster()
const keysStore = useKeysStore()
const emitter = useEmitter()
const save = async () => {
  let params = [name.value]
  switch (type.value) {
    case 'string':
      params.push(...values.value)
      if (ttl.value > 0) {
        params.push('EX', String(ttl.value))
      }
      await redis.client.set(...params)
      break
    case 'hash':
      params.push(hashName.value, ...values.value)
      await redis.client.hSet(...params)
      break
    case 'list':
      if (index.value !== '') {
        params.push(index.value)
      }
      params.push(...values.value)
      if (index.value !== '') {
        await redis.client.lSet(...params)
      } else {
        await redis.client.lPush(...params)
      }
      break
    case 'set':
      params.push(...values.value)
      await redis.client.sAdd(...params)
      break
    case 'zset':
      await redis.client.zAdd(name.value, {score: score.value, value: values.value[0]})
      break
  }

  emit('update:show', false)
  toaster.success(`Key ${ name.value } added`)
  await keysStore.loadKeys()
  keysStore.selected = name.value
  keysStore.refreshTTL()
  emitter.emit('key-updated', name.value)
}
</script>

<style scoped>

</style>
