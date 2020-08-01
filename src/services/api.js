import fetch from '../utils/request'
import {
  GET_CITY,
  GET_CAR_TYPES,
  GET_CONSUME_LIST,
  GET_SIT_LIST,
  GET_LOCATION_LIST,
  GET_CHARTERED_PAGE,
  GET_CHARTERED_DETAIL,
  GET_CHARTERED_LIST
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
