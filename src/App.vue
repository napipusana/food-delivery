<template lang="pug">
  #app
    nav-bar
    .container
      router-view
    Footer
</template>
<script>
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
export default {
  components: {
    NavBar,
    Footer
  }
}
</script>
<style lang="scss">
.container {
  padding: 10px 0 0 0;
}
</style>
