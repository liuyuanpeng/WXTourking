import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchCityList} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'city',
  state: {
    list: [],
    current: {name: ''}
  },
  reducers: {},
  effects: {
    *updateCity({payload, success, fail}, {put, select}) {
      const cityList = yield select(state=>state.city.list)
      const current = cityList.find(item=>item.id === payload.id)
      
      if (current) {
        yield put({
          type: 'updateState',
          payload: {
            current
          }
        })
        success && success()
      } else {
        fail && fail()
      }
    },
    *getCityList({success, fail}, {call, put, select}) {
      const res = yield call(fetchCityList)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {list: res.data}
        })

        const current = yield select(state=>state.city.current)
        if (!current.id) {
          const xm = res.data.find(item=>item.name.indexOf('厦门')>=0)
          if (xm) {
            yield put({
              type: 'updateState',
              payload: {
                current: xm
              }
            })
          } else {
            yield put({
              type: 'updateState',
              payload: {
                current: res.data[0]
              }
            })
          }
        }

        success && success()
      } else {
        fail && fail(res.message)
      }
    }
  }
})
