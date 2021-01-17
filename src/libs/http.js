import axios from 'axios'
// import Vue from 'vue'
const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 20000
})

export default instance
