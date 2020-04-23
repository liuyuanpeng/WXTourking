import 'taro-ui/dist/style/index.scss'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import HomePage from './pages/home'

import './app.less'
import './theme.scss'

import dva from './utils/dva'
import models from './models/index'
import action from './utils/action'

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
  onError(e, dispatch) {
    dispatch(action('sys/error', e))
  }
})
const store = dvaApp.getStore()

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5') {
  require('nerv-devtools')
}

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError(err) {
    console.log(err)
  }

  config = {
    pages: [
      'pages/home/index',
      'pages/discovery/index',
      'pages/schedule/index',
      'pages/mine/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationStyle: "custom",
      navigationBarTextStyle: 'black',
      backgroundColorTop: '#0068C4',
      enablePullDownRefresh: true
    },
    tabBar: {
      color: '#B2B1AF',
      selectedColor: '#000000',
      backgroundColor: '#FFFFFF',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/home/index',
          text: '首页',
          iconPath: './asset/images/home.png',
          selectedIconPath: './asset/images/home_focus.png'
        },
        {
          pagePath: 'pages/discovery/index',
          text: '发现',
          iconPath: './asset/images/discovery.png',
          selectedIconPath: './asset/images/discovery_focus.png'
        },
        {
          pagePath: 'pages/schedule/index',
          text: '行程',
          iconPath: './asset/images/schedule.png',
          selectedIconPath: './asset/images/schedule_focus.png'
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: './asset/images/mine.png',
          selectedIconPath: './asset/images/mine_focus.png'
        }
      ]
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <HomePage />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
