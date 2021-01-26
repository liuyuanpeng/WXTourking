import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchUserBillHeader, saveUserBillHeader, deleteUserBillHeader} from '../services/api.js'
import Taro from '@tarojs/taro'
import STORAGE from '@constants/storage'

export default modelExtend(commonModel, {
  namespace: 'header',
  state: {
    list: [],
    defaultHeader: undefined
  },
  reducers: {},
  effects: {
    *getUserBillHeader({success, fail}, {call, put}) {
      const res = yield call(fetchUserBillHeader, {user_id: Taro.getStorageSync(STORAGE.USER_ID)})
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {
            list: res.data
          }
        })
        if (res.data) {
          const defaultBillHeader = res.data.find(item=>item.set_default)
          yield put({
            type: 'updateState',
            payload: {
              defaultBillHeader
            }
          })
        }
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *saveUserBillHeader({payload, success, fail}, {call, put}) {
      const res = yield call(saveUserBillHeader, {
        ...payload,
        user_id: Taro.getStorageSync(STORAGE.USER_ID)
      })
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'getUserBillHeader'
        })
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *deleteUserBillHeader({payload, success, fail}, {call, put}) {
      const res = yield call(deleteUserBillHeader, payload)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'getUserBillHeader'
        })
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
  }
})
