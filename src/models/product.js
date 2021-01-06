import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {
  fetchProductPage,
  fetchProduct,
  fetchProductList
} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'product',
  state: {
    detail: {},
    ROAD: [],
    hot: [],
    hotJINGDIAN: [],
    hotMEISHI: [],
    hotBANSHOU: [],
    JINGDIAN: [],
    MEISHI: [],
    BANSHOU: [],
    recommend: []
  },
  reducers: {},
  effects: {
    *getProductList(
      { target = 'ROAD', success, fail },
      { call, put, select }
    ) {
      const currentCity = yield select(state => state.city.current)
      const params = { city_id: currentCity.id }
      params.scene = [`${target}_PRIVATE`].toString()
      const res = yield call(fetchProductList, params)
      if (res.code === 'SUCCESS') {
        const newState = {}
        newState[target] = res.data
        yield put({
          type: 'updateState',
          payload: newState
        })
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *getHotProduct({ target = 'hot', success, fail }, { call, put, select }) {
      const currentCity = yield select(state => state.city.current)
      let scene
      if (target === 'hot' || target === 'recommend') {
        scene = ['ROAD_PRIVATE'].toString()
      } else if (target.indexOf('JINGDIAN') >= 0) {
        scene = ['JINGDIAN_PRIVATE'].toString()
      } else if (target.indexOf('MEISHI') >= 0) {
        scene = ['MEISHI_PRIVATE'].toString()
      } else if (target.indexOf('BANSHOU') >= 0) {
        scene = ['BANSHOU_PRIVATE'].toString()
      }
      const res = yield call(fetchProductPage, {
        query: {
          city_id: currentCity.id,
          scene
        },
        body: {
          page: 0,
          size: target === 'recommend' ? 6 : 3
        }
      })
      if (res.code === 'SUCCESS') {
        const newState = {}
        newState[target] = res.data.data_list
        yield put({
          type: 'updateState',
          payload: newState
        })
        success && success(res.data.data_list)
      } else {
        fail && fail(res.message)
      }
    },
    *getProduct({ id, success, fail }, { call, put }) {
      const res = yield call(fetchProduct, id)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: { detail: res.data }
        })
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    }
  }
})
