import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchProductPage, fetchHotSearchList} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'search',
  state: {
    list: [],
    hotSearch: []
  },
  reducers: {},
  effects: {
    *getHotSearchList({success, fail}, {select, call, put}) {
      const currentCity = yield select(state=>state.city.current)
      const res = yield call(fetchHotSearchList, currentCity.id)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {
            hotSearch: res.data
          }
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *getSearchResult({value, success, fail}, {call, put, select}) {
      const currentCity = yield select(state=>state.city.current)
      const res = yield call(fetchProductPage, {
        query: {
          city_id: currentCity.id,
          scene: ['JINGDIAN_PRIVATE', 'MEISHI_PRIVATE', 'BANSHOU_PRIVATE'].toString(),
          value
        },
        body: {
          size: 20
        }
      })
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {list: res.data.data_list}
        })

        success && success(res.data.data_list)
      } else {
        fail && fail(res.message)
      }
    }
  }
})
