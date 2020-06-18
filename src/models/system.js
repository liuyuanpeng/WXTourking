import modelExtend from 'dva-model-extend'
import commonModel from './common'

export default modelExtend(commonModel, {
  namespace: 'system',
  state: {
    info:{}
  },
  reducers: {},
  effects: {
    *updateSystemInfo({payload}, {put}) {
      yield put({
        type: 'updateState',
        payload: {info: payload}
      })
    }
  }
})
