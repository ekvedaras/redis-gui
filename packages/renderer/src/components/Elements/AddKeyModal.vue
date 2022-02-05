<template>
  <AppModal title="Add new key" @close="emit('close')">
    <div class="flex space-x-4">
      <input v-model="name" type="text" placeholder="Name" class="flex-1" />
      <input v-if="type === 'hash'" v-model="hashName" type="text" placeholder="Hash key name" class="flex-1" />
      <input v-if="type === 'list'" v-model="index" type="number" placeholder="Index" class="flex-1" />
      <input v-if="type === 'zset'" v-model="score" type="number" placeholder="Score" class="flex-1" />
      <select v-model="type">
        <option value="string">
          string
        </option>
        <option value="hash">
          hash
        </option>
        <option value="list">
          list
        </option>
        <option value="set">
          set
        </option>
        <option value="zset">
          zset
        </option>
      </select>
    </div>
    <textarea v-for="valIndex in values.keys()" :key="valIndex" v-model="values[valIndex]" class="flex-1" placeholder="Value" />
    <div class="flex justify-end space-x-4">
      <Button v-if="['list', 'set'].indexOf(type) > -1" @click="values.push('')">
        Add
      </Button>
      <input v-if="type === 'string'" v-model="ttl" type="number" class="w-20" placeholder="TTL" />
      <Button @click="emit('close')">
        Cancel
      </Button>
      <PrimaryButton @click="save">
        Save
      </PrimaryButton>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { onMounted, ref, toRef, watch } from 'vue'
import AppModal from '/@/components/Elements/AppModal.vue'
import Button from '/@/components/Elements/Button.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'
import type { StringArray } from '../../../types/models'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import { useKeysStore } from '/@/store/keys'
import useEmitter from '/@/use/emitter'

const props = withDefaults(defineProps<{
  fill?: StringArray;
}>(), {
  fill: () => ({}),
})

const emit = defineEmits<{
  (e: 'close'): void;
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

  emit('close')
  toaster.success(`Key ${ name.value } added`)
  await keysStore.loadKeys()
  keysStore.selected = name.value
  keysStore.refreshTTL()
  emitter.emit('key-updated', name.value)
}
</script>

<style scoped>

</style>
