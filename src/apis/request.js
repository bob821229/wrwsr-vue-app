import http from './http'

export function apiGet(url, params = {}, config = {}) {
  return http({
    url,
    method: 'get',
    params,
    ...config
  })
}

export function apiPost(url, data = {}, config = {}) {
  return http({
    url,
    method: 'post',
    data,
    ...config
  })
}