<template>
  <div>
    <label for="database">Database:</label>
    <select id="database" name="database" @change="selectDb($event.target.value)">
      <option v-for="(n, index) in totalDatabases" :key="index" :value="index" :selected="index === currentDatabase">
        db{{ index }}
        {{ databases.hasOwnProperty(index) ? `(${databases[index].keys} keys)` : '' }}
      </option>
    </select>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'DatabaseSelect',
  methods: mapActions(['selectDb']),
  computed: mapState(['totalDatabases', 'databases', 'currentDatabase']),
}
</script>

<style scoped>

</style>
