import fetch from '../utils/request'
import {
  GET_CITY,
  GET_HOT_SEARCH,
  GET_CAR_TYPES,
  GET_CONSUME_LIST,
  GET_SIT_LIST,
  GET_LOCATION_LIST,
  GET_CHARTERED_PAGE,
  GET_CHARTERED_DETAIL,
  GET_CHARTERED_LIST,
  GET_USER_ADDRESS,
  SAVE_USER_ADDRESS,
  DELETE_USER_ADDRESS,
  EVALUATE_DRIVER,
  EVALUATE_ORDER,
  EVALUATE_PAGE,
  COUPON_PAGE,
  COUPON_OBTAIN,
  COUPON_USABLE,
  COUPON_POOL
} from '@constants/api'
import qs from 'query-string'

export function fetchProductPage({ query, body }) {
  return fetch({
    url: `${GET_CHARTERED_PAGE}?${qs.stringify(query)}`,
    method: 'POST',
    payload: {
      page: 0,
      size: 10,
      ...body,
      sort_data_list: [
        {
          direction: 'DESC',
          property: 'weight'
        }
      ]
    }
  })
}
export function fetchProductList(params) {
  return fetch({
    url: `${GET_CHARTERED_LIST}?${qs.stringify(params)}`,
    method: 'POST',
    payload: [
      {
        direction: 'DESC',
        property: 'weight'
      }
    ]
  })
}

export function fetchHotSearchList(city_id) {
  return fetch({
    url: `${GET_HOT_SEARCH}`,
    method: 'POST',
    payload: {
      city_id
    }
  })
}

export function fetchProduct(id) {
  return fetch({
    url: `${GET_CHARTERED_DETAIL}?private_consume_id=${id}`
  })
}

export function fetchLocationList(city_id) {
  return fetch({
    url: `${GET_LOCATION_LIST}${city_id ? `?city_id=${city_id}` : ''}`,
    method: 'POST',
    payload: {
      page: 0,
      size: 30
    }
  })
}

export function fetchCityList() {
  return fetch({
    url: GET_CITY,
    method: 'POST',
    payload: {}
  })
}

export function fetchCarTypes() {
  return fetch({
    url: GET_CAR_TYPES,
    method: 'POST',
    payload: {}
  })
}

export function fetchSitList() {
  return fetch({
    url: GET_SIT_LIST,
    method: 'POST',
    payload: {}
  })
}

export function fetchConsumeList(params) {
  return fetch({
    url: `${GET_CONSUME_LIST}?${qs.stringify(params)}`,
    method: 'POST',
    payload: []
  })
}

export function fetchUserAddress(payload) {
  return fetch({
    url:GET_USER_ADDRESS,
    method: 'POST',
    payload
  })
}

export function saveUserAddress(payload) {
  return fetch({
    url: SAVE_USER_ADDRESS,
    method: 'POST',
    payload
  })
}

export function deleteUserAddress(params) {
  return fetch({
    url: DELETE_USER_ADDRESS.replace('ADDRESS_ID', params.id),
    method: 'POST'
  })
}

export function evaluateDriver(payload) {
  return fetch({
    url: EVALUATE_DRIVER,
    method: 'POST',
    payload
  })
}

export function evaluateOrder(payload) {
  return fetch({
    url: EVALUATE_ORDER,
    method: 'POST',
    payload
  })
}

export function fetchEvaluatePage(payload) {
  const {page, size, ...params} = payload
  return fetch({
    url: EVALUATE_PAGE+`?status=1&${qs.stringify(params)}`,
    method: 'POST',
    payload: {
      page,
      size
    }
  })
}

export function fetchCouponPage(params) {
  return fetch({
    url: COUPON_PAGE,
    method: 'POST',
    payload: {page_request_data:{
      page: 0,
      size: 100,
      sort_data_list: [
        {
          direction: 'DESC',
          property: 'createTime'
        }
      ]
    },
    ...params}
  })
}

export function obtainCoupon(params) {
  return fetch({
    url: COUPON_OBTAIN+`?${qs.stringify(params)}`,
    method: 'GET'
  })
}

export function fetchUsableCoupon(payload) {
  return fetch({
    url: COUPON_USABLE,
    method: 'POST',
    payload: {
      ...payload
    }
  })
}

export function fetchCouponList(payload) {
  return fetch({
    url: COUPON_POOL,
    method: 'POST',
    payload
  })
}
