<template>
  <div>
    <ul>
      <li v-for="key in keys" :key="key" @click="loadKey(key)">
        {{ key }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Keys',
  computed: mapState(['keys']),
  methods: mapActions(['loadKey'])
}
</script>

<style scoped>

</style>
