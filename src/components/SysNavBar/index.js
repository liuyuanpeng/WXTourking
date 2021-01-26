import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

class SysNavBar extends Taro.Component {
  static defaultProps = {
    title: '',
    transparent: false,
    hideBack: false,
    noBorder: false,
    redirectTo: '',
    goHome: false
  }

  onBack = e => {
    e.stopPropagation()
    const { redirectTo, goHome } = this.props
    if (goHome) {
      Taro.switchTab({
        url: '../home/index'
      })
    } else if (redirectTo) {
      Taro.redirectTo({
        url: `../../pages/${redirectTo}/index`
      })
    } else {
      Taro.navigateBack()
    }
  }

  render() {
    const { title, transparent, hideBack, noBorder } = this.props
    const barHeight = Taro.$statusBarHeight + 88 + 'rpx'
    return (
      <View
        className='sys-nav-bar'
        style={
          transparent
            ? {
                height: barHeight,
                backgroundColor: 'transparent',
                border: 'none'
              }
            : noBorder
            ? { height: barHeight, border: 'none' }
            : { height: barHeight }
        }
      >
        {!hideBack && <View className='back-btn' onClick={this.onBack} />}
        <View className='sys-nav-title'>{title}</View>
      </View>
    )
  }
}
export default SysNavBar

// 这里导航栏内容可以自行配置
