import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchCouponList, fetchCouponPage, obtainCoupon, fetchUsableCoupon} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'coupon',
  state: {
    list: [],
    usedList: [],
    overdueList: [],
    usableList: [],
    pool: {}
  },
  reducers: {},
  effects: {
    *getCouponList({payload, success, fail}, {call, put}) {
      const {status} = payload
      const res = yield call(fetchCouponPage, payload)
      if (res.code === 'SUCCESS') {
        const newState = {}
        if (status === 1) {
          newState.list = res.data.data_list
        } else if (status === 2) {
          newState.usedList = res.data.data_list
        } else if (status === 3) {
          newState.overdueList = res.data.data_list
        } else {
          return
        }
        yield put({
          type: 'updateState',
          payload: {...newState}
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *getPool({payload, success, fail}, {call, put}) {
      const res = yield call(fetchCouponList, payload)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {pool: res.data&&res.data.length ? res.data[0] : {}}
        })
        success && success(res.data&&res.data.length ? res.data[0] : {})
      } else {
        fail && fail(res.message)
      }
    },
    *obtainCoupon({payload, success, fail}, {call}) {
      const res = yield call(obtainCoupon, payload)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *getUsableCoupon({payload, success, fail}, {call, put}) {
      const res = yield call(fetchUsableCoupon, payload)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {
            usableList: res.data
          }
        })
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    }
  }
})
