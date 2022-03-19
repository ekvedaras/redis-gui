<script setup lang="ts">
import { ref, watch } from 'vue'
import AppModal from '/@/components/Elements/AppModal.vue'
import Button from '/@/components/Elements/Button.vue'
import PrimaryButton from '/@/components/Elements/PrimaryButton.vue'
import { useRedis } from '/@/use/redis'
import { useToaster } from '/@/use/toaster'
import { useKeysStore } from '/@/store/keys'
import useEmitter from '/@/use/emitter'
import TimeIcon from '/@/components/Icons/TimeIcon.vue'
import KeyItemControls from '/@/components/Elements/KeyItemControls.vue'

export type AddModalFillOptions = {
  name?: string,
  hashName?: string,
  score?: number,
  index?: string,
  type?: 'string' | 'list' | 'set' | 'zset' | 'hash',
  ttl?: number,
  values?: string[],
}

const props = withDefaults(defineProps<{
  fill?: AddModalFillOptions;
}>(), {
  fill: () => ({}),
})

const emit = defineEmits<{
  (e: 'close'): void;
}>()

const name = ref(props.fill.name ?? '')
const hashName = ref(props.fill.hashName ?? '')
const score = ref(props.fill.score ?? 0)
const index = ref(props.fill.index ?? '')
const type = ref<'string' | 'list' | 'set' | 'zset' | 'hash'>(props.fill.type ?? 'string')
const ttl = ref(props.fill.ttl ?? 0)
const values = ref(props.fill.values ?? [''])

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
  switch (type.value) {
    case 'string':
      await redis.client.set(name.value, values.value[0], ttl.value ? {EX: ttl.value} : undefined)
      break
    case 'hash':
      await redis.client.hSet(name.value, hashName.value, values.value[0])
      break
    case 'list':
      if (index.value !== '' && values.value.length === 1) {
        await redis.client.lSet(name.value, index.value, values.value[0])
      } else {
        await redis.client.lPush(name.value, Object.values(values.value).reverse())
      }
      break
    case 'set':
      await redis.client.sAdd(name, Object.values(values.value))
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

<template>
  <AppModal title="Add new key" @close="emit('close')">
    <div class="flex space-x-4">
      <input v-model="name" type="text" placeholder="Name" class="flex-1" />
      <input v-if="type === 'hash'" v-model="hashName" type="text" placeholder="Hash key name" class="flex-1" />
      <input v-if="type === 'list' && values.length === 1" v-model="index" type="number" placeholder="Index" class="flex-1" />
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
    <div v-for="valIndex in values.keys()" :key="valIndex" class="relative">
      <textarea v-model="values[valIndex]" class="w-full" placeholder="Value" />
      <KeyItemControls v-if="valIndex !== 0" class="p-0" delete-only @delete="values.splice(valIndex, 1)" />
    </div>
    <div class="flex justify-end space-x-4 items-center">
      <Button v-if="['list', 'set'].indexOf(type) > -1" @click="values.push('')">
        Add
      </Button>
      <div v-if="type === 'string'" class="flex items-center flex-1">
        <input id="ttl" v-model="ttl" type="number" class="w-20" placeholder="TTL" />
        <label for="ttl" class="ml-2 font-semibold">
          <TimeIcon v-tooltip.right="'TTL in seconds'" class="w-4 h-4" />
        </label>
      </div>
      <Button @click="emit('close')">
        Cancel
      </Button>
      <PrimaryButton @click="save">
        Save
      </PrimaryButton>
    </div>
  </AppModal>
</template>
