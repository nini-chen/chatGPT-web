/*
 * @Author: neon_chen 1826650603@qq.com
 * @Date: 2023-12-24 20:10:51
 * @LastEditors: neon_chen 1826650603@qq.com
 * @LastEditTime: 2023-12-26 08:58:59
 * @FilePath: \gtp\src\utils\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import qs from 'qs'
console.log(import.meta.env.VITE_BASE_URL)
// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // url = base url + request url
  // baseURL: 'http://192.168.5.72:9999/',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})


service.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken()
    // }
    // if (config.url === '/stream.php') {
    //   config.headers['Accept'] = 'text/event-stream'
    // }
    if (config.params) {
      config.params = config.params._rawValue
    }
    if (config.data) {
      config.data = qs.stringify(config.data._rawValue)
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)


export default service