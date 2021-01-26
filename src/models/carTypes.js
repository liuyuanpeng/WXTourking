import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchCarTypes} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'carTypes',
  state: {
    list: []
  },
  reducers: {},
  effects: {
    *getCarTypes({success, fail}, {call, put}) {
      const res = yield call(fetchCarTypes)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {list: res.data}
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    }
  }
})
