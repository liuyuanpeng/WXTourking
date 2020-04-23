import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtCalendar } from 'taro-ui'

import '../common/index.less'

import homePng from '../../asset/images/bkg.png'

class Home extends Component {
  config = {
    navigationBarTitleText: '旅王出行',
    usingComponents: {
      navbar: '../../components/Navbar/index' //自定义navigationBar
    }
  }

  render() {
    return (
      <View className='page'>
        <navbar />
        <Image className='common-image' src={homePng} />
        <AtButton type='primary'>测试taroUI主题颜色</AtButton>
        <AtCalendar />
      </View>
    )
  }
}

export default Home
