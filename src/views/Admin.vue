<template lang="pug">
  .container
    .about
      h1.my-3 This is an Admin page
      loading(v-if="loading")
      table.table(v-if="!loading")
        thead
          tr
            th ID
            th Name
            th Order At
            th total price
            th items
        tbody
          tr(v-for='model in models', :key='model.id')
            td {{ model.id }}
            td {{ model.name }}
            td {{ toFulldate(model.createdAt) }}
            td {{ model.totalPrice }}
            td {{ model.items }}
</template>
<script>
import moment from 'moment'
import Loading from '@/components/Loading'
import OrderService from '@/services/order'
export default {
  components: {
    Loading
  },
  data () {
    return {
      models: [],
      loading: true
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      OrderService.findAll()
        .then(models => {
          this.models = models
          this.loading = false
        })
    },
    toFulldate (d) {
      return moment(d).format('DD-MM-YYYY HH:mm')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
