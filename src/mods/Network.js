import axios from 'axios'

export default {
  baseUrl() {
    if (typeof window !== 'undefined') {
      return ''
    } else {
      return 'http://localhost:8080'
    }
  },
  get(url, params) {
    return axios({
      method: 'get',
      url: this.baseUrl() + url,
      params: params || {},
    })
  },
  post(url, data) {
    return axios({
      method: 'post',
      url: this.baseUrl() + url,
      data: data || {},
    })
  }
}