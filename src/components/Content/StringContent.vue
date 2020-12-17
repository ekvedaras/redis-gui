<template>
  <div class="overflow-y-auto">
    <Value class="relative" v-if="!isLoading" :value="value" @save="save" without-delete/>
    <CenteredLoader v-if="isLoading"/>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import Value from '@/components/Elements/Value'
import CenteredLoader from '@/components/Elements/CenteredLoader'

export default {
  name: 'StringContent',
  components: { CenteredLoader, Value },
  props: ['name'],
  data: () => ({
    value: '',
    isLoading: true,
  }),
  async mounted () {
    this.value = await redis.async('get', this.name)
    this.isLoading = false
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
