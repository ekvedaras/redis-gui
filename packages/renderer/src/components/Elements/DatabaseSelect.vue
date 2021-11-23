<template>
  <select id="database" @change="store.dispatch('select', $event.target.value)">
    <option v-for="(_db, index) in store.state.databases.total" :key="index" :value="index" :selected="index === store.state.databases.selected">
      db{{ index }} {{ keys(index) }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { useStore } from '/@/store'
// import { EventBus } from '@/services/eventBus'
// mounted () {
//   EventBus.$on('key-updated', this.load)
// },

const store = useStore()
const keys = (index: number) => {
  if (Object.prototype.hasOwnProperty.call(store.state.databases.list, index)) {
    return `(${ store.state.databases.list[index].keys } keys)`
  }

  return ''
}
</script>
