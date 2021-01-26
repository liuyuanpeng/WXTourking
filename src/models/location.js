import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchLocationList} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'location',
  state: {
    airports: [],
    trains: []
  },
  reducers: {},
  effects: {
    *getLocationList({success, fail}, {call, put, select}) {
      const currentCity = yield select(state=>state.city.current)
      const res = yield call(fetchLocationList, currentCity.id)
      const list = res.data?(res.data.data_list || []):[]
      const airports = []
      const trains = []
      list.forEach(item=>{
        if (item.type) {
          trains.push(item)
        } else {
          airports.push(item)
        }
      })
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {airports, trains }
        })

        success && success()
      } else {
        fail && fail(res.message)
      }
    }
  }
})
