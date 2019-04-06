import request from '@/utils/request'
import { stringify } from 'qs'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    // url: 'upms/sys/user/login',
    url: '/login/login',
    method: 'post',
    data: stringify(data)
  })
}
// test
export function testApi() {
  return request({
    method: 'get',
    url: 'upms/sys/user/test'
  })
}

export function logout() {
  return request({
    url: 'upms/sys/user/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'upms/sys/user/info',
    method: 'get',
    params: { token }
  })
}

