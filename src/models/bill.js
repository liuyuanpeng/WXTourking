import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {
  fetchBillPage,
  fetchBillPrice,
  fetchCreateBill
} from '../services/api.js'
import Taro from '@tarojs/taro'
import STORAGE from '@constants/storage'

export default modelExtend(commonModel, {
  namespace: 'bill',
  state: {
    list: [],
    price: 0
  },
  reducers: {},
  effects: {
    *getBillPrice({ success, fail }, { call, put }) {
      const res = yield call(fetchBillPrice)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {
            price: res.data || 0
          }
        })
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *getBillPage({ payload, success, fail }, { call, put }) {
      const {user_id, page, size} = payload
      const params = {
        user_id,
        page_request_data: {
          page,
          size,
          sort_data_list:[{
            direction: 'DESC',
            property: 'createTime'
          }]
        }
      }
      const res = yield call(fetchBillPage, params)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {
            list: res.data.data_list
          }
        })
        success && success(res.data.data_list)
      } else {
        fail && fail(res.message)
      }
    },
    *saveBill({ payload, success, fail }, { call }) {
      const res = yield call(fetchCreateBill, payload)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    }
  }
})
