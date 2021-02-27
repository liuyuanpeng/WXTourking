import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {
  saveDiscovery,
  fetchDiscoveryPage,
  fetchDiscoveryUnfavor,
  fetchDiscoveryFavor,
  fetchDiscoveryFavorPage,
  fetchDiscoveryComment,
  fetchDiscoveryCommentPage,
  fetchDiscoveryLikePage,
  fetchDiscoveryLike,
  fetchDiscoveryUnlike
} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'discovery',
  state: {
    listJINGDIAN: [],
    listMEISHI: [],
    listSHIPIN: [],
    listGONGLUE: [],
    listLikeJINGDIAN: [],
    listLikeMEISHI: [],
    listLikeSHIPIN: [],
    listLikeGONGLUE: [],
    listFavorJINGDIAN: [],
    listFavorMEISHI: [],
    listFavorSHIPIN: [],
    listFavorGONGLUE: [],
    listComment: []
  },
  reducers: {},
  effects: {
    *getDiscoveryList({ payload, success, fail }, { call, put }) {
      const {
        faxian_category = 'JINGDIAN',
        page_request_data = {
          page: 0,
          size: 500,
          sort_data_list: [
            {
              direction: 'DESC',
              property: 'createTime'
            }
          ]
        }
      } = payload
      const res = yield call(fetchDiscoveryPage, {
        faxian_category,
        page_request_data
      })
      if (res.code === 'SUCCESS' && res.data) {
        const newState = {}
        newState['list' + faxian_category] = res.data.data_list
        yield put({
          type: 'updateState',
          payload: { ...newState }
        })
        success && success()
      } else {
        fail && fail(res.message)
      }
    },
    *saveDiscovery({ payload, success, fail }, { select, call }) {
      const currentCity = yield select(state => state.city.current)

      if (!currentCity || !currentCity.id) {
        fail && fail('获取城市列表失败')
        return
      }
      const res = yield call(saveDiscovery, {
        city_id: currentCity.id,
        ...payload
      })
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *getDiscoveryLikeList({ payload, success, fail }, { call, put }) {
      const { faxian_category = 'JINGDIAN' } = payload
      const res = yield call(fetchDiscoveryLikePage, {
        page_request_data: {
          page: 0,
          size: 200,
          sort_data_list: [
            {
              direction: 'DESC',
              property: 'createTime'
            }
          ]
        },
        ...payload
      })
      if (res.code === 'SUCCESS' && res.data) {
        const newState = {}
        newState[`listLike${faxian_category}`] = res.data.data_list
        yield put({
          type: 'updateState',
          payload: newState
        })
        success && success(res.data.data_list)
      } else {
        fail && fail(res.message)
      }
    },
    *likeDiscovery({ payload, success, fail }, { call }) {
      const res = yield call(fetchDiscoveryLike, payload)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *unlikeDiscovery({ payload, success, fail }, { call }) {
      const res = yield call(fetchDiscoveryUnlike, payload.id)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *getDiscoveryCommentList({ payload, success, fail }, { call, put }) {
      const res = yield call(fetchDiscoveryCommentPage, {
        page_request_data: {
          page: 0,
          size: 200,
          sort_data_list: [
            {
              direction: 'DESC',
              property: 'createTime'
            }
          ]
        },
        ...payload
      })
      if (res.code === 'SUCCESS' && res.data) {
        yield put({
          type: 'updateState',
          payload: { listComment: res.data.data_list }
        })
        success && success(res.data.data_list)
      } else {
        fail && fail(res.message)
      }
    },
    *commentDiscovery({ payload, success, fail }, { call }) {
      const res = yield call(fetchDiscoveryComment, payload)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *getDiscoveryFavorList({ payload, success, fail }, { call, put }) {
      const { faxian_category = 'JINGDIAN' } = payload
      const res = yield call(fetchDiscoveryFavorPage, {
        page_request_data: {
          page: 0,
          size: 200,
          sort_data_list: [
            {
              direction: 'DESC',
              property: 'createTime'
            }
          ]
        },
        ...payload
      })
      if (res.code === 'SUCCESS' && res.data) {
        const newState = {}
        newState[`listFavor${faxian_category}`] = res.data.data_list
        yield put({
          type: 'updateState',
          payload: newState
        })
        success && success(res.data.data_list)
      } else {
        fail && fail(res.message)
      }
    },
    *favorDiscovery({ payload, success, fail }, { call }) {
      const res = yield call(fetchDiscoveryFavor, payload)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    },
    *unfavorDiscovery({ payload, success, fail }, { call }) {
      const res = yield call(fetchDiscoveryUnfavor, payload.id)
      if (res.code === 'SUCCESS') {
        success && success(res.data)
      } else {
        fail && fail(res.message)
      }
    }
  }
})
