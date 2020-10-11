<template>
  <select id="database" @change="select($event.target.value)">
    <option v-for="(n, index) in total" :key="index" :value="index" :selected="index === selected">
      db{{ index }}
    </option>
  </select>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'DatabaseSelect',
  computed: mapState('databases', ['total', 'list', 'selected']),
  methods: mapActions('databases', ['select']),
}
</script>

<style scoped>

</style>
