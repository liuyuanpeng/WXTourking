import modelExtend from 'dva-model-extend'
import commonModel from './common'

export default modelExtend(commonModel, {
  namespace: 'home',
  state: {
    count: 0,
    currentIdx: 0
  },
  reducers: {},
  effects: {
    *add({}, { select, put }) {
      const { count } = yield select(_ => _.homepage)
      yield put({
        type: 'updateState',
        payload: { count: count + 1 }
      })
    },
    *minus({}, { select, put }) {
      const { count } = yield select(_ => _.homepage)
      yield put({
        type: 'updateState',
        payload: { count: count - 1 }
      })
    }
  }
})
