import Taro from '@tarojs/taro'
import STORAGE from '@constants/storage'

export default function fetch(opt) {
  const {url, payload, method='GET'} = opt
  const token = Taro.getStorageSync(STORAGE.TOKEN)
  const header = token ? {'token': token} : {}
  if (method === 'POST') {
    header['content-type'] = 'application/json'
  }
  return Taro.request({
    url, method, data: payload, header
  }).then(res=>{
    const {statusCode, data} = res;
    if (statusCode >= 200 && statusCode < 300) {
      if (data.code === "TOKEN_SESSION_NOT_FOUND" || data.code === "AUTHORIZE_HEADER_IS_NULL") {
        Taro.clearStorageSync()
        Taro.navigateTo({
          url: '../../pagesLogin/login/index'
        })
      } else if (data.code !== 'SUCCESS') {
        Taro.showToast({title: data.message, icon: 'none'})
      }
      return data;
    } else {
      throw new Error(`网络请求错误，状态码${statusCode}`);
    }
  })
}
