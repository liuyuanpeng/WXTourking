import modelExtend from 'dva-model-extend'
import commonModel from './common'
import {fetchConsumeList} from '../services/api.js'

export default modelExtend(commonModel, {
  namespace: 'consume',
  state: {
    consume: {},
    consumes: {},
    lowPrice: {}
  },
  reducers: {},
  effects: {
    *getConsumeList({payload, success, fail}, {call, put}) {
      const {params} = payload
      const res = yield call(fetchConsumeList, params)
      if (res.code === 'SUCCESS') {
        if (res.data && res.data.length) {
          const {consume, car_levels} = res.data[0]
          let carLevels = car_levels.sort((a, b)=>{
            return a.zuowei.name.localeCompare(b.zuowei.name)
          })
          let consumes = {}
          carLevels.forEach(item=>{
            if (consumes[item.zuowei.name]) {
              consumes[item.zuowei.name].push(item)
            } else {
              consumes[item.zuowei.name] = [item]
            }
          })
          // 计算最低价
          const lowPrice = {}
          Object.keys(consumes).forEach(key => {
            let min_price = 0
            consumes[key].forEach(item=>{
              min_price = min_price < item.price ? item.price : min_price
            })
            lowPrice[key] = min_price
          })
          yield put({
            type: 'updateState',
            payload: {
              consume,
              consumes,
              lowPrice
            }
          })

        success && success(res.data)
        } else {
          fail && fail()
        }
        
      } else {
        fail && fail(res.message)
      }
    }
  }
})
