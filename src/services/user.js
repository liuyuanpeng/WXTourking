import fetch from '../utils/request'
import { GET_USER, UPDATE_USER, GET_SESSION, GET_PHONE } from '@constants/api'
import qs from 'query-string'

export function fetchPhone(payload) {
  return fetch({
    url: GET_PHONE,
    method: 'POST',
    payload
  })
}

export function fetchSession(code) {
  return fetch({
    url: GET_SESSION,
    method: 'POST',
    payload: {
      code,
      username: 'username'
    }
  })
}

export function fetchUserInfo(payload) {
  return fetch({
    url: `${GET_USER}?${qs.stringify(payload)}`
  })
}

export function updateUserInfo(payload) {
  return fetch({
    url: UPDATE_USER,
    method: 'POST',
    payload
  })
}