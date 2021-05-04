import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import dva from './utils/dva'
import models from './models'
import Taro from '@tarojs/taro'

import './app.scss'
import './theme.scss'
import { requestType, infoType } from './@types/common'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
const dvaApp = dva.createApp({
  initialState: {},
  models: models,
})
const store = dvaApp.getStore()

class App extends React.Component {
  componentWillMount() {
    const res = Taro.getSystemInfoSync()
    window.$statusBarHeight = res.windowWidth
      ? res.statusBarHeight / (res.windowWidth / 750)
      : 0
    window.$screenWidth = res.screenWidth / (res.windowWidth / 750)
    window.$screenHeight = res.screenHeight / (res.windowWidth / 750)
    window.$windowHeight = res.windowWidth
      ? res.windowHeight / (res.windowWidth / 750)
      : 0
    window.$tabbarHeight = res.windowWidth
      ? (res.screenHeight - res.windowHeight) / 750
      : 0
  }

  componentDidMount() {
    Taro.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({
            scope: 'scope.userLocation',
          })
        }
      },
    })
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError(err) {
    console.log(err)
  }

  render() {
    return <Provider store={store}>{this.props.children}</Provider>
  }
}

export default App
