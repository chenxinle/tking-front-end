import axios from 'axios'

export default {
  get(url, params) {
    return axios({
      method: 'get',
      url: url,
      params: params || {},
      proxy: {
        host: '127.0.0.1',
        port: 8080
      }
    })
  },
  post(url, data) {
    return axios({
      method: 'post',
      url: url,
      data: data || {},
      proxy: {
        host: '127.0.0.1',
        port: 8080
      }
    })
  }
}