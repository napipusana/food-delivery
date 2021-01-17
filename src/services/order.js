import http from '@/libs/http'

export default {
  findAll () {
    return http.get('/order')
      .then(response => response.data)
  }
}
