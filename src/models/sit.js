import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchSitList} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'sit',
  state: {
    list: []
  },
  reducers: {},
  effects: {
    *getSitList({success, fail}, {call, put}) {
      const res = yield call(fetchSitList)
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
