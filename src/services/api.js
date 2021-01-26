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
  COUPON_POOL,
  DISCOVERY_COMMENT,
  DISCOVERY_COMMENT_PAGE,
  DISCOVERY_FAVOR,
  DISCOVERY_FAVOR_PAGE,
  DISCOVERY_LICK_PAGE,
  DISCOVERY_LIKE,
  DISCOVERY_PAGE,
  DISCOVERY_SAVE,
  DISCOVERY_UNFAVOR,
  DISCOVERY_UNLICK
} from '@constants/api'
import qs from 'query-string'
import { COUPON_OBTAIN_CHECK, CREATE_BILL, DELETE_USER_BILL_HEADER, GET_BILL_PAGE, GET_BILL_PRICE, GET_USER_BILL_HEADER, SAVE_USER_BILL_HEADER } from '../constants/api'

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
        },
        {
          direction: 'DESC',
          property: 'createTime'
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
      },
      {
        direction: 'DESC',
        property: 'createTime'
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
    url: GET_USER_ADDRESS,
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


export function fetchUserBillHeader(payload) {
  return fetch({
    url: GET_USER_BILL_HEADER,
    method: 'POST',
    payload
  })
}

export function saveUserBillHeader(payload) {
  return fetch({
    url: SAVE_USER_BILL_HEADER,
    method: 'POST',
    payload
  })
}

export function deleteUserBillHeader(params) {
  return fetch({
    url: DELETE_USER_BILL_HEADER.replace('HEADER_ID', params.id),
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
  const { page, size, ...params } = payload
  return fetch({
    url: EVALUATE_PAGE + `?status=1&${qs.stringify(params)}`,
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
    payload: {
      page_request_data: {
        page: 0,
        size: 100,
        sort_data_list: [
          {
            direction: 'DESC',
            property: 'createTime'
          }
        ]
      },
      ...params
    }
  })
}

export function obtainCoupon(params) {
  return fetch({
    url: COUPON_OBTAIN + `?${qs.stringify(params)}`,
    method: 'GET'
  })
}

export function obtainCouponCheck(params) {
  return fetch({
    url: COUPON_OBTAIN_CHECK + `?${qs.stringify(params)}`,
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

export function fetchDiscoveryPage(payload) {
  return fetch({
    url: DISCOVERY_PAGE,
    method: 'POST',
    payload: {
      ...payload,
      valid: true
    }
  })
}

export function saveDiscovery(payload) {
  return fetch({
    url: DISCOVERY_SAVE,
    method: 'POST',
    payload
  })
}

export function fetchDiscoveryLikePage(payload) {
  return fetch({
    url: DISCOVERY_LICK_PAGE,
    method: 'POST',
    payload
  })
}

export function fetchDiscoveryLike(payload) {
  return fetch({
    url: DISCOVERY_LIKE,
    method: 'POST',
    payload
  })
}

export function fetchDiscoveryUnlike(id) {
  return fetch({
    url: DISCOVERY_UNLICK.replace('{id}', id),
    method: 'POST'
  })
}

export function fetchDiscoveryCommentPage(payload) {
  return fetch({
    url: DISCOVERY_COMMENT_PAGE,
    method: 'POST',
    payload: {
      ...payload,
      valid: true
    }
  })
}

export function fetchDiscoveryComment(payload) {
  return fetch({
    url: DISCOVERY_COMMENT,
    method: 'POST',
    payload
  })
}

export function fetchDiscoveryFavorPage(payload) {
  return fetch({
    url: DISCOVERY_FAVOR_PAGE,
    method: 'POST',
    payload
  })
}

export function fetchDiscoveryFavor(payload) {
  return fetch({
    url: DISCOVERY_FAVOR,
    method: 'POST',
    payload
  })
}

export function fetchDiscoveryUnfavor(id) {
  return fetch({
    url: DISCOVERY_UNFAVOR.replace('{id}', id),
    method: 'POST'
  })
}

export function fetchCreateBill(payload) {
  return fetch({
    url: CREATE_BILL,
    method: 'post',
    payload
  })
}

export function fetchBillPage(payload) {
  return fetch({
    url: GET_BILL_PAGE,
    method: 'post',
    payload
  })
}

export function fetchBillPrice() {
  return fetch({
    url: GET_BILL_PRICE,
    method: 'get'
  })
}
