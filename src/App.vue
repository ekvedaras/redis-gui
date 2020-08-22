<template>
  <div id="app">
    <Navigation/>
    <div class="text-center">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
export default {
  components: { Navigation },
}
</script>

<style>

</style>
