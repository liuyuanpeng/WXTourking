import modelExtend from 'dva-model-extend'
import commonModel from './common'
import { fetchOrders, fetchOrderDetail } from '../services/order'
import Taro from '@tarojs/taro'
import STORAGE from '../constants/storage'

const SIZE = 10

export default modelExtend(commonModel, {
  namespace: 'order',
  state: {
    allOrders: { page: 0, size: SIZE, data_list: [] },
    waitForPayOrders: { page: 0, size: SIZE, data_list: [] },
    waitForGoOrders: { page: 0, size: SIZE, data_list: [] },
    finishOrders: { page: 0, size: SIZE, data_list: [] },
    waitForCommentOrders: { page: 0, size: SIZE, data_list: [] },
    orderDetail: {},
    baocheOrders: { page: 0, size: SIZE, data_list: [] },
    jiejiOrders: { page: 0, size: SIZE, data_list: [] },
    xianluOrders: { page: 0, size: SIZE, data_list: [] }
  },
  reducers: {},
  effects: {
    *getAllOrders({ query = {}, more, success, fail }, { call, put, select }) {
      const body = { page: 0, size: SIZE }
      const allOrders = yield select(state => state.order.allOrders)
      if (more) {
        body.page = allOrders.page + 1
      }

      const res = yield call(fetchOrders, {
        query: {
          user_id: Taro.getStorageSync(STORAGE.USER_ID),
          ...query
        },
        body
      })
      if (res.code === 'SUCCESS') {
        success && success()
        yield put({
          type: 'updateState',
          payload: {
            allOrders: {
              page: res.data.page,
              size: res.data.size,
              data_list: more
                ? allOrders.data.concat(res.data.data_list)
                : res.data.data_list
            }
          }
        })
      } else {
        fail && fail(res.message)
      }
    },
    *getBAOCHE({ more, success, fail }, { call, put, select }) {
      const body = { page: 0, size: SIZE }
      const baocheOrders = yield select(state => state.order.baocheOrders)
      if (more) {
        body.page = baocheOrders.page + 1
      }

      const res = yield call(fetchOrders, {
        query: {
          user_id: Taro.getStorageSync(STORAGE.USER_ID),
          scenes: ['DAY_PRIVATE', 'JINGDIAN_PRIVATE'].toString()
        },
        body
      })
      if (res.code === 'SUCCESS') {
        success && success()
        yield put({
          type: 'updateState',
          payload: {
            baocheOrders: {
              page: res.data.page,
              size: res.data.size,
              data_list: more
                ? baocheOrders.data.concat(res.data.data_list)
                : res.data.data_list
            }
          }
        })
      } else {
        fail && fail(res.message)
      }
    },
    *getJIEJI({ more, success, fail }, { call, put, select }) {
      const body = { page: 0, size: SIZE }
      const jiejiOrders = yield select(state => state.order.jiejiOrders)
      if (more) {
        body.page = jiejiOrders.page + 1
      }

      const res = yield call(fetchOrders, {
        query: {
          user_id: Taro.getStorageSync(STORAGE.USER_ID),
          scenes: ['JIEJI', 'SONGJI'].toString()
        },
        body
      })
      if (res.code === 'SUCCESS') {
        success && success()
        yield put({
          type: 'updateState',
          payload: {
            jiejiOrders: {
              page: res.data.page,
              size: res.data.size,
              data_list: more
                ? jiejiOrders.data.concat(res.data.data_list)
                : res.data.data_list
            }
          }
        })
      } else {
        fail && fail(res.message)
      }
    },
    *getXIANLU({ more, success, fail }, { call, put, select }) {
      const body = { page: 0, size: SIZE }
      const xianluOrders = yield select(state => state.order.xianluOrders)
      if (more) {
        body.page = xianluOrders.page + 1
      }

      const res = yield call(fetchOrders, {
        query: {
          user_id: Taro.getStorageSync(STORAGE.USER_ID),
          scenes: ['ROAD_PRIVATE'].toString()
        },
        body
      })
      if (res.code === 'SUCCESS') {
        success && success()
        yield put({
          type: 'updateState',
          payload: {
            xianluOrders: {
              page: res.data.page,
              size: res.data.size,
              data_list: more
                ? xianluOrders.data.concat(res.data.data_list)
                : res.data.data_list
            }
          }
        })
      } else {
        fail && fail(res.message)
      }
    },
    *getOrderDetail({ payload, success, fail }, { call, put }) {
      const res = yield call(fetchOrderDetail, payload)
      if (res.code === 'SUCCESS') {
        success && success()
        yield put({
          type: 'updateState',
          payload: { orderDetail: res.data }
        })
      } else {
        fail && fail(res.message)
      }
    }
  }
})
