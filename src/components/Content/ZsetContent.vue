<template>
  <div class="p-4">
    <div v-for="(item, score) in value" :key="score">
      <b>{{ score }}</b>
      <ValueRenderer :value="item"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { redis } from '@/services/redis'
import ValueRenderer from '@/components/Renderer/ValueRenderer'

export default {
  name: 'ZsetContent',
  components: { ValueRenderer },
  props: ['name'],
  data: () => ({
    value: [],
  }),
  async mounted () {
    this.value = _.fromPairs(
        _.chunk(
            await redis.async('zrange', this.name, 0, 100, 'withscores')
            , 2,
        ).map(chunk => _.reverse(chunk)),
    )
  },
}
</script>

<style scoped>

</style>
