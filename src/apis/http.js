import axios from 'axios'

function getRequestVerificationHeaders() {
  const formToken = window.RequestVerificationToken || ''
  const cookieToken = window.__RequestVerificationToken || ''

  const headers = {}

  if (formToken) {
    headers.RequestVerificationToken = formToken
  }

  if (cookieToken) {
    headers.__RequestVerificationToken = cookieToken
  }

  return headers
}

const http = axios.create({
  timeout: 15000,
  withCredentials: true
})

http.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      ...getRequestVerificationHeaders()
    }
    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const message =
      error?.response?.data?.errorMessage ||
      error?.response?.data?.message ||
      '系統發生錯誤，請稍後再試'

    if (status === 401) {
      alert('您尚未登入或登入逾時，請重新登入系統')
      window.location.href = '/account/login'
      return Promise.reject(error)
    }

    if (status === 400) {
      alert(message)
      return Promise.reject(error)
    }

    if (!error?.response) {
      alert('網路異常或伺服器無回應')
      return Promise.reject(error)
    }

    alert(message)
    return Promise.reject(error)
  }
)

export default http