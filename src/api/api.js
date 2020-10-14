//处理异步
import apiConfig from './api_config'
import axios from 'axios'

//axios.defaults.withCredentials = true
const obj = {}

for (const i in apiConfig) {
  const config = apiConfig[i]
  obj[i] = (params) => {
    return new Promise((resolve, reject) => {
      const opt = {
        method: config.method || 'get',
        url: config.url
      }
      if (config.method === 'post') {
        opt.data = params
      } else {
        opt.params = params
      }
      axios(opt).then(res => {
        if (res.data.successFlag === "Y" || res.data.code === 1) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      }).catch(error => {
        var err = {
          errorMsg: "网络开小差了，请稍后重试！"
        }
        reject(err)
      })
    })
  }
}

export default obj
