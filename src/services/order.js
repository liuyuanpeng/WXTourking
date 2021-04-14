import fetch from '../utils/request'
import {
  host,
  GET_TRIP_PAGE,
  GET_ORDER_DETAIL,
  GET_PRICE,
  CREATE_ORDER,
  CONFIRM_ORDER,
  CANCEL_ORDER,
  GET_CONSUME_LIST,
  GET_ORDER_BILL_PAGE,
  MODIFY_PRICE
} from '@constants/api'
import qs from 'query-string'

export function queryConsumeList(params) {
  return fetch({
    url: `${GET_CONSUME_LIST}?${qs.stringify(params)}`,
    method: 'POST',
    payload: []
  })
}

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

export function modifyPrice(payload) {
  return fetch({
    url: MODIFY_PRICE,
    method: 'POST',
    payload
  })
}

export function confirmOrder(order_id) {
  return fetch({
    url: `${CONFIRM_ORDER}?order_id=${order_id}`,
    method:  'POST'
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
  const {status, ...others} = query
  const querys = others
  if(status === 'WAIT_APPROVAL_OR_PAY') {
    querys.has_pay = false
  } else {
    querys.status = status
  }
  return fetch({
    url: `${GET_TRIP_PAGE}?${qs.stringify(querys)}`,
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
