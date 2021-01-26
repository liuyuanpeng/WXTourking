import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {evaluateDriver, evaluateOrder, fetchEvaluatePage} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'evaluate',
  state: {
    list: []
  },
  reducers: {},
  effects: {
    *getEvaluateList({payload, success, fail}, {call, put}) {
      const res = yield call(fetchEvaluatePage, payload)
      if (res.code === 'SUCCESS') {
        yield put({
          type: 'updateState',
          payload: {list: res.data.data_list}
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *evaluateDriver({payload, success, fail}, {call}) {
      const res = yield call(evaluateDriver, payload)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *evaluateOrder({payload, success, fail}, {call}) {
      const res = yield call(evaluateOrder, payload)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    }
  }
})
