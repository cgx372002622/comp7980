import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router/index'
const baseURL = '/api'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

//以下两个是拦截器，一个是得到请求前拦截，一个是得到请求之后拦截

instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    // console.log(useStore.token)
    if (useStore.token) {
      config.headers.Authorization = `Bearer ${useStore.token}`
    }
    console.log(config)
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    console.log(res)
    if (res.status === 200) {
      if(res.data.message){
        ElMessage.success(res.data.message)
      }
      return res.data
    }
    ElMessage.error(res.data.message || 'Service Error')
    return Promise.reject(res.data)
  },
  (err) => {
    console.log(err)
    if (err.response?.data === 401) {
      router.push('/login')
    }
    ElMessage.error(err.response.data || 'Service Error')
    // TODO 5. 处理401错误
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
