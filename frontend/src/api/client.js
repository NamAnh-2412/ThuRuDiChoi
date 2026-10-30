import axios from 'axios'

export const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const headers = config.headers
  const existing = headers?.Authorization || headers?.authorization || headers?.get?.('Authorization')
  const token = sessionStorage.getItem('token')
  if (token && !existing) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    if (
      error.response?.status === 401 &&
      !url.includes('/admin/login') &&
      window.location.pathname.startsWith('/admin')
    ) {
      sessionStorage.removeItem('token')
      window.location.assign('/admin/login')
    }
    return Promise.reject(error)
  },
)

export async function uploadImage(file) {
  const body = new FormData()
  body.append('file', file)
  const { data } = await api.post('/admin/uploads', body)
  return data.url
}

export function errorMessage(error, fallback) {
  const data = error?.response?.data
  if (!data) return fallback
  if (typeof data === 'string') return data
  return data.message || data.detail || fallback
}
