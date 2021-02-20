import STORAGE from '@constants/storage'
import Taro from '@tarojs/taro'

export function returnFloat(value) {
  let result = Math.round(parseFloat(value) * 100) / 100
  const s = result.toString().split('.')
  if (s.length == 1) {
    result = result.toString() + '.00'
    return result
  }
  if (s.length > 1) {
    if (s[1].length < 2) {
      result = result.toString() + '0'
    }
    return result
  }
}

export function isLogin() {
  return !!Taro.getStorageSync(STORAGE.TOKEN)
}

export function checkLogin() {
  if (Taro.getStorageSync(STORAGE.TOKEN)) {
    return true
  } else {
    Taro.navigateTo({
      url: '../../pagesLogin/login/index'
    })
    return false
  }
}
