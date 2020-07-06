import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchUserInfo, updateUserInfo, fetchSession, fetchPhone} from '../services/user'
import Taro from '@tarojs/taro'
import STORAGE from '../constants/storage'

export default modelExtend(commonModel, {
  namespace: 'user',
  state: {
    
  },
  reducers: {},
  effects: {
    *getPhone({payload, success, fail}, {call}) {
      const res = yield call(fetchPhone, {...payload, session_key: Taro.getStorageSync(STORAGE.SESSION_KEY)})
      if (res.code === 'SUCCESS') {
        success && success(res.data)
        console.log('res.data', res.data)
        Taro.setStorageSync(STORAGE.USER_PHONE, res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *getSession({success, fail}, {call}) {
      const res = yield call(fetchSession, Taro.getStorageSync(STORAGE.USER_CODE))
      if (res.code === 'SUCCESS' && res.data) {
        try {
          const result  = JSON.parse(res.data)
          success && success(res.data)
          Taro.setStorageSync(STORAGE.SESSION_KEY, result.session_key)
          Taro.setStorageSync(STORAGE.OPEN_ID, result.openid)
        } catch (error) {
          console.log(error)
        }
      } else {
        fail && fail(res.message)
      }
    },
    *getUserInfo({success, fail}, {call, put}) {
      const res = yield call(fetchUserInfo, {user_id: Taro.getStorageSync(STORAGE.USER_ID)})
      if (res.code === 'SUCCESS') {
        success && success()
        const app = Taro.getApp()
        app.globalData.userInfo= res.data.user
        yield put({
          type: 'updateState',
          payload: {...res.data.user}
        })
      } else {
        fail && fail(res.message)
      }
    },
    *updateUserInfo({payload, success, fail}, {call, put, select}) {
      const userInfo = yield select(state=>state.user)
      const params = {
        ...userInfo,
        user_id: userInfo.id,
        ...payload
      }
      const res = yield call(updateUserInfo, params)
      if (res.code === 'SUCCESS') {
        success && success()
        const app = Taro.getApp()
        app.globalData.userInfo= res.data.user
        yield put({
          type: 'updateState',
          payload: {...res.data.user}
        })
      } else {
        fail && fail(res.message)
      }
    }
  }
})
