<template>
  <table class="w-full">
    <thead>
    <tr>
      <th>Name</th>
      <th>Keys</th>
      <th>Expires</th>
      <th>Average TTL</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(database, id) in databases" :key="database.id" :database="database">
      <th>{{ id }}</th>
      <td>{{ database.keys }}</td>
      <td>{{ database.expires }}</td>
      <td>{{ database.avg_ttl }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>

export default {
  name: 'KeyspaceInfo',
  props: {
    info: Object,
  },
  computed: {
    databases () {
      let databases = {}, propKey, value

      Object.keys(this.info).forEach(key => {
        databases[key] = {}
        this.info[key].split(',').forEach(prop => {
          [propKey, value] = prop.split('=')
          databases[key][propKey] = value
        })
      })

      return databases
    },
  },
}
</script>

<style scoped>

</style>
