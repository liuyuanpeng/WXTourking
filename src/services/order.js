import fetch from '../utils/request'
import { GET_TRIP_PAGE, GET_ORDER_DETAIL } from '../constants/api'
import qs from 'query-string'

export function fetchOrders(payload) {
  const {query, body} = payload
  return fetch({
    url: `${GET_TRIP_PAGE}?${qs.stringify(query)}`,
    method: 'POST',
    payload: {
      ...body,
      sort_data_list: []
    }
  })
}

export function fetchOrderDetail(payload) {
  return fetch({
    url: `${GET_ORDER_DETAIL}?${qs.stringify(payload)}`,
    payload
  })
}