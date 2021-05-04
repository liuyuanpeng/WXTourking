import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {
  fetchUserInfo,
  updateUserInfo,
  fetchSession,
  fetchPhone
} from '../services/user'
import Taro from '@tarojs/taro'
import STORAGE from '@constants/storage'
import { fetchScanCount } from '../services/api'

export default modelExtend(commonModel, {
  namespace: 'user',
  state: {},
  reducers: {},
  effects: {
    *getPhone({ payload, success, fail }, { call }) {
      const res = yield call(fetchPhone, {
        ...payload,
        session_key: Taro.getStorageSync(STORAGE.SESSION_KEY)
      })
      if (res.code === 'SUCCESS') {
        Taro.setStorageSync(STORAGE.USER_PHONE, res.data)
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },

    *scanCount(_, {call}) {
      // 统计扫码商家
      const source_shop_id = Taro.getStorageSync(STORAGE.SOURCE_SHOP_ID)
      const open_id = Taro.getStorageSync(STORAGE.OPEN_ID)
      const user_wxname = Taro.getStorageSync(STORAGE.WX_NICKNAME)
      const user_wxavatar = Taro.getStorageSync(STORAGE.WX_AVATAR)

      if (source_shop_id && open_id ) {
        yield call(fetchScanCount, {
          source_shop_id,
          open_id,
          user_wxavatar: user_wxavatar || '',
          user_wxname: user_wxname || ''
        })
      }
    },

    *getSession({ success, fail, refetch }, { call }) {
      const res = yield call(
        fetchSession,
        Taro.getStorageSync(STORAGE.USER_CODE)
      )
      if (res.code === 'SUCCESS' && res.data) {
        try {
          const result = JSON.parse(res.data)
          if (!result.session_key || !result.openid) {
            return
          }
          Taro.setStorageSync(STORAGE.SESSION_KEY, result.session_key)
          Taro.setStorageSync(STORAGE.OPEN_ID, result.openid)
          success && success(res.data)

          // 统计扫码商家
          const source_shop_id = Taro.getStorageSync(STORAGE.SOURCE_SHOP_ID)
          const user_wxname = Taro.getStorageSync(STORAGE.WX_NICKNAME)
          const user_wxavatar = Taro.getStorageSync(STORAGE.WX_AVATAR)
          if (source_shop_id && result.open_id) {
            yield call(fetchScanCount, {
              source_shop_id,
              open_id: result.openid,
              user_wxavatar: user_wxavatar || '',
              user_wxname: user_wxname || ''
            })
          }
        } catch (error) {
          console.log(error)
        }
      } else if (res.code === 'SUCCESS' && res.data === '') {
        refetch && refetch()
      } else {
        fail && fail(res.message)
      }
    },
    *getUserInfo({ success, fail }, { call, put }) {
      const res = yield call(fetchUserInfo, {
        user_id: Taro.getStorageSync(STORAGE.USER_ID)
      })
      if (res.code === 'SUCCESS') {
        // USER_ID消失 暂时这里保存 原因待查
        Taro.setStorageSync(STORAGE.USER_ID, res.data.user.id)
        yield put({
          type: 'updateState',
          payload: { ...res.data.user }
        })
        success && success(res.data.user)
      } else {
        fail && fail(res.message)
      }
    },
    *updateUserInfo({ payload, success, fail }, { call, put, select }) {
      const userInfo = yield select(state => state.user)
      const params = {
        ...userInfo,
        user_id: userInfo.id,
        ...payload
      }
      const res = yield call(updateUserInfo, params)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: { ...res.data.user }
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    }
  }
})
