<template>
  <div class="overflow-y-auto">
    <Value class="relative" :value="value" @save="save" without-delete/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import Value from '@/components/Elements/Value'

export default {
  name: 'StringContent',
  components: { Value },
  props: ['name'],
  data: () => ({
    value: '',
  }),
  async mounted () {
    this.value = await redis.async('get', this.name)
  },
  methods: {
    save ({ value }) {
      redis.async('set', this.name, value)
          .then(() => this.value = value)
          .then(() => this.$toasted.success('Saved'))
    },
  },
}
</script>

<style scoped>

</style>
