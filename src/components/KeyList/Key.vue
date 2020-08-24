<template>
  <div @click="setCurrentKey(redisKey)">
     {{ name }} ({{ redisKey.type }})
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Key',
  props: ['redisKey', 'name'],
  methods: mapMutations(['setCurrentKey']),
}
</script>

<style scoped>

</style>
