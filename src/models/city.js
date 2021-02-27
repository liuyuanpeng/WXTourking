import modelExtend from 'dva-model-extend'
import commonModel from './common'
import { fetchCityList } from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'city',
  state: {
    list: [],
    current: {name: ''},
    name: ''
  },
  reducers: {},
  effects: {
    *setCurrent({ name }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          name
        }
      })
    },
    *updateCity({ payload, success, fail }, { put, select }) {
      const cityList = yield select(state => state.city.list)
      const current = cityList.find(item => item.id === payload.id)

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
    *getCityList({ success, fail }, { call, put, select }) {
      const res = yield call(fetchCityList)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: { list: res.data }
        })

        const name = yield select(state => state.city.name)
        const current = yield select(state => state.city.current)
        let cur = current
        if (!cur.id) {
          cur = res.data.find(item => item.name.indexOf(name) >= 0)
          cur = cur || res.data[0]
          yield put({
            type: 'updateState',
            payload: {
              current: cur
            }
          })
        }
        success && success(cur)
      } else {
        fail && fail(res.message)
      }
    }
  }
})
