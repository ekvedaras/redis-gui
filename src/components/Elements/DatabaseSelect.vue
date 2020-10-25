<template>
  <select id="database" @change="select($event.target.value)">
    <option v-for="(db, index) in total" :key="index" :value="index" :selected="index === selected">
      db{{ index }} {{ keys(index) }}
    </option>
  </select>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { EventBus } from '@/services/eventBus'

export default {
  name: 'DatabaseSelect',
  computed: mapState('databases', ['total', 'list', 'selected']),
  mounted () {
    EventBus.$on('key-updated', this.load)
  },
  methods: {
    ...mapActions('databases', ['select', 'load']),
    keys (index) {
      if (Object.prototype.hasOwnProperty.call(this.list, index)) {
        return `(${this.list[index].keys} keys)`
      }

      return ''
    },
  },
}
</script>

<style scoped>

</style>
