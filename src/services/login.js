import fetch from '../utils/request'
import { GET_SESSION, GET_CAPTCHA, LOGIN } from '@constants/api'

export function fetchLogin(payload) {
  return fetch({
    url: LOGIN,
    method: 'POST',
    payload
  })
}

export function fetchCaptcha(payload) {
  return fetch({
    url: GET_CAPTCHA,
    method: 'POST',
    payload
  })
}

export function fetchSession(payload) {
  return fetch({
    url: GET_SESSION,
    method: 'POST',
    payload
  })
}