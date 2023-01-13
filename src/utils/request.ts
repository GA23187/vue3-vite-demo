import axios from 'axios'

axios.defaults.withCredentials = true

const service = axios.create({
  timeout: 50000,
  baseURL: '/'
})

const responseHandle = (config) => {
  console.log(config)
}
const responseErrorHandle = (error) => {
  console.log(error, 'responseErrorHandle')
  return Promise.reject(error)
}
const requestHandle = (config) => {
  console.log(config)
  return config
}
const requestErrorHandle = (error) => {
  console.log(error)
  return Promise.reject(error)
}
service.interceptors.response.use(responseHandle, responseErrorHandle)
service.interceptors.request.use(requestHandle, requestErrorHandle)

export function getAjax<T = any>(url: string, params = {}, myConfig = {}) {
  return new Promise<T>((resolve, reject) => {
    service
      .get(url, {
        params,
        ...myConfig
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
