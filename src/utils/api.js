import axios from 'axios'
import { getToken, removeToken } from './isAuth'
import { BASE_URL } from './url'

const API = axios.create({
  baseURL: BASE_URL
})

// 添加请求拦截器
API.interceptors.request.use(config => {
  const { url } = config

  if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registe')) {
    // 添加token
    config.headers.Authorization = getToken()
  }
  return config
})

// 添加响应拦截器
API.interceptors.response.use(response => {
  // 拿到状态吗
  const { status } = response.data

  if (status === 400) {
    // 说明token失效
    removeToken()
  }
  return response
})

export { API }