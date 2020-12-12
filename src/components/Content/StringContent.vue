<template>
  <div class="overflow-y-auto">
    <Value class="relative" v-if="!isLoading" :value="value" @save="save" without-delete/>
    <div v-if="isLoading" class="flex w-full h-full justify-center items-center">
      Loading <Spinner class="relative ml-2"/>
    </div>
  </div>
</template>

<script>
import { redis } from '@/services/redis'
import Value from '@/components/Elements/Value'
import Spinner from '@/components/Elements/Spinner'

export default {
  name: 'StringContent',
  components: { Spinner, Value },
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
