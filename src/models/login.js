import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchCaptcha, fetchLogin} from '../services/login'
import Taro from '@tarojs/taro'
import STORAGE from '@constants/storage'

export default modelExtend(commonModel, {
  namespace: 'login',
  state: {
    captcha_session_id: "",
    username: "",
    userInfo: {}
  },
  reducers: {},
  effects: {
    *login({payload, success, fail}, {call, put, select}) {
      const {captcha} = payload
      const data = yield select(state=>state.login)
      const {username, captcha_session_id} = data
      const app = Taro.getApp()
      const res = yield call(fetchLogin, {
        captcha_session_id,
        captcha,
        mobile: username,
        username: app.globalData.wxInfo.nickName || '微信用户',
        open_id: Taro.getStorageSync(STORAGE.OPEN_ID)
      })
      if (res.code === 'SUCCESS') {
        app.globalData.userInfo= res.data.user
        Taro.setStorageSync(STORAGE.TOKEN, res.data.token_session.token)
        Taro.setStorageSync(STORAGE.USER_ID, res.data.user.id)
        yield put({
          type: 'updateState',
          payload: {userInfo: res.data.user}
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *getCaptcha({payload, success, fail}, {call, put }) {
      const res = yield call(fetchCaptcha, payload)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: res.data
        })
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    }
  }
})
