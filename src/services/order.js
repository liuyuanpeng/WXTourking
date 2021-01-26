import fetch from '../utils/request'
import {
  host,
  GET_TRIP_PAGE,
  GET_ORDER_DETAIL,
  GET_PRICE,
  CREATE_ORDER,
  CANCEL_ORDER
} from '@constants/api'
import qs from 'query-string'
import { GET_ORDER_BILL_PAGE } from '../constants/api'

export function cancelOrder(id) {
  return fetch({
    url: `${CANCEL_ORDER}?order_id=${id}`,
    method: 'POST'
  })
}

export function payOrder(id) {
  return fetch({
    url: `${host}/travel/weixin/pay/fake_notify?order_id=${id}`,
    method: 'POST'
  })
}

export function createOrder(payload) {
  return fetch({
    url: CREATE_ORDER,
    method: 'POST',
    payload
  })
}

export function fetchPrice(payload) {
  return fetch({
    url: GET_PRICE,
    method: 'POST',
    payload
  })
}

export function fetchOrders(payload) {
  const { query, body } = payload
  return fetch({
    url: `${GET_TRIP_PAGE}?${qs.stringify(query)}`,
    method: 'POST',
    payload: {
      ...body,
      sort_data_list: [
        {
          direction: 'DESC',
          property: 'createTime'
        }
      ]
    }
  })
}

export function fetchBillOrders(payload) {
  const {query, body} = payload
  return fetch({
    url: `${GET_ORDER_BILL_PAGE}?${qs.stringify(query)}`,
    method: 'POST',
    payload: {
      ...body,
      sort_data_list: [
        {
          direction: 'DESC',
          property: 'createTime'
        }
      ]
    }
  }) 
}

export function fetchOrderDetail(payload) {
  return fetch({
    url: `${GET_ORDER_DETAIL}?${qs.stringify(payload)}`,
    payload
  })
}
