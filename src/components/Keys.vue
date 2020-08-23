<template>
  <div>
    <ul>
      <li v-for="key in keys" :key="key.name" @click="setCurrentKey(key)">
        {{ key.name }} ({{ key.type }})
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Keys',
  computed: mapState(['keys']),
  methods: mapMutations(['setCurrentKey'])
}
</script>

<style scoped>

</style>
