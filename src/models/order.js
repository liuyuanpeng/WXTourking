import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {
  fetchOrders,
  fetchBillOrders,
  fetchOrderDetail,
  fetchPrice,
  createOrder,
  cancelOrder,
  payOrder
} from '../services/order'
import Taro from '@tarojs/taro'
import STORAGE from '@constants/storage'

const SIZE = 1000

export default modelExtend(commonModel, {
  namespace: 'order',
  state: {
    userOrder: {},
    order: {},
    allOrders: { page: 0, size: SIZE, data_list: [] },
    waitForPayOrders: { page: 0, size: SIZE, data_list: [] },
    waitForGoOrders: { page: 0, size: SIZE, data_list: [] },
    finishOrders: { page: 0, size: SIZE, data_list: [] },
    waitForCommentOrders: { page: 0, size: SIZE, data_list: [] },
    orderDetail: {},
    baocheOrders: { page: 0, size: SIZE, data_list: [] },
    jiejiOrders: { page: 0, size: SIZE, data_list: [] },
    xianluOrders: { page: 0, size: SIZE, data_list: [] },
    billOrders: { page: 0, size: SIZE, data_list: [] },
    finishBillOrders: { page: 0, size: SIZE, data_list: [] }
  },
  reducers: {},
  effects: {
    *payOrder({ payload, success, fail }, { call, select, put }) {
      const res = yield call(payOrder, payload.id)
      if (res.code === 'SUCCESS') {
        const userOrder = yield select(state => state.order.userOrder)
        yield put({
          type: 'updateState',
          payload: {
            userOrder: {
              ...userOrder,
              order: {
                ...userOrder.order,
                order_status: 'AUTO'
              }
            }
          }
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *setUserOrder({ payload, success }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          userOrder: {
            ...payload
          }
        }
      })
      success && success()
    },
    *cancelOrder({ payload, success, fail }, { call, put, select }) {
      const res = yield call(cancelOrder, payload.id)
      if (res.code === 'SUCCESS') {
        const userOrder = yield select(state => state.order.userOrder)
        yield put({
          type: 'updateState',
          payload: {
            userOrder: {
              ...userOrder,
              order: {
                ...userOrder.order,
                order_status: 'CANCEL_USER'
              }
            }
          }
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *createOrder({ payload, success, fail }, { call }) {
      const res = yield call(createOrder, payload)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *getPrice({ payload = {}, success, fail }, { call }) {
      const res = yield call(fetchPrice, payload)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *getBillOrders({ bill_type = 1, success, fail }, { call, put }) {
      const body = { page: 0, size: SIZE }
      const query = {
        user_id: Taro.getStorageSync(STORAGE.USER_ID),
        type: bill_type
      }
      const res = yield call(fetchBillOrders, { query, body })
      if (res.code === 'SUCCESS') {
        if (bill_type === 1) {
          yield put({
            type: 'updateState',
            payload: {
              billOrders: {
                page: 0,
                size: SIZE,
                data_list: res.data.data_list
              }
            }
          })
        } else {
          yield put({
            type: 'updateState',
            payload: {
              finishBillOrders: {
                page: 0,
                size: SIZE,
                data_list: res.data.data_list
              }
            }
          })
        }
        success && success(res.data.data_list)
      } else {
        fail && fail(res.message)
      }
    },
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
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *getWaitForPay({ more, success, fail }, { call, put, select }) {
      const body = { page: 0, size: SIZE }
      const waitForPayOrders = yield select(
        state => state.order.waitForPayOrders
      )
      if (more) {
        body.page = waitForPayOrders.page + 1
      }

      const res = yield call(fetchOrders, {
        query: {
          user_id: Taro.getStorageSync(STORAGE.USER_ID),
          status: ['WAIT_APPROVAL_OR_PAY'].toString()
        },
        body
      })
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {
            waitForPayOrders: {
              page: res.data.page,
              size: res.data.size,
              data_list: more
                ? waitForPayOrders.data.concat(res.data.data_list)
                : res.data.data_list
            }
          }
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *getWaitForGo({ more, success, fail }, { call, put, select }) {
      const body = { page: 0, size: SIZE }
      const waitForGoOrders = yield select(state => state.order.waitForGoOrders)
      if (more) {
        body.page = waitForGoOrders.page + 1
      }

      const res = yield call(fetchOrders, {
        query: {
          user_id: Taro.getStorageSync(STORAGE.USER_ID),
          status: ['WAIT_ACCEPT', 'AUTO', 'ACCEPTED'].toString()
        },
        body
      })
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {
            waitForGoOrders: {
              page: res.data.page,
              size: res.data.size,
              data_list: more
                ? waitForGoOrders.data.concat(res.data.data_list)
                : res.data.data_list
            }
          }
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *getFinish({ more, success, fail }, { call, put, select }) {
      const body = { page: 0, size: SIZE }
      const finishOrders = yield select(state => state.order.finishOrders)
      if (more) {
        body.page = finishOrders.page + 1
      }

      const res = yield call(fetchOrders, {
        query: {
          user_id: Taro.getStorageSync(STORAGE.USER_ID),
          status: ['DONE'].toString()
        },
        body
      })
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {
            finishOrders: {
              page: res.data.page,
              size: res.data.size,
              data_list: more
                ? finishOrders.data.concat(res.data.data_list)
                : res.data.data_list
            }
          }
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *getWaitForComment({ more, success, fail }, { call, put, select }) {
      const body = { page: 0, size: SIZE }
      const waitForCommentOrders = yield select(
        state => state.order.waitForCommentOrders
      )
      if (more) {
        body.page = waitForCommentOrders.page + 1
      }

      const res = yield call(fetchOrders, {
        query: {
          user_id: Taro.getStorageSync(STORAGE.USER_ID),
          status: ['DONE'].toString(),
          evaluate: false
        },
        body
      })
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {
            waitForCommentOrders: {
              page: res.data.page,
              size: res.data.size,
              data_list: more
                ? waitForCommentOrders.data.concat(res.data.data_list)
                : res.data.data_list
            }
          }
        })
        success && success()
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
          scene: ['DAY_PRIVATE', 'JINGDIAN_PRIVATE'].toString()
        },
        body
      })
      if (res.code === 'SUCCESS') {
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
        success && success()
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
          scene: ['JIEJI', 'SONGJI'].toString()
        },
        body
      })
      if (res.code === 'SUCCESS') {
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
        success && success()
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
          scene: ['ROAD_PRIVATE'].toString()
        },
        body
      })
      if (res.code === 'SUCCESS') {
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
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *getOrderDetail({ payload, success, fail }, { call, put }) {
      const res = yield call(fetchOrderDetail, payload)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: { orderDetail: res.data }
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    }
  }
})
