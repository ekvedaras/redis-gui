<template>
  <select
    id="database"
    @change="select"
  >
    <option
      v-for="(_db, index) in databasesStore.total"
      :key="index"
      :value="index"
      :selected="index === databasesStore.selected"
    >
      db{{ index }} {{ keys(index) }}
    </option>
  </select>
</template>

<script setup lang="ts">
// TODO
// import { EventBus } from '@/services/eventBus'
// mounted () {
//   EventBus.$on('key-updated', this.load)
// },

import { useDatabasesStore } from '/@/store/databases'

const databasesStore = useDatabasesStore()
const keys = (index: number) => {
  if (Object.prototype.hasOwnProperty.call(databasesStore.list, index)) {
    return `(${ databasesStore.list[index].keys } keys)`
  }

  return ''
}

const select = ({target}: Event) => {
  databasesStore.select(Number((target as HTMLSelectElement).value))
}
</script>
