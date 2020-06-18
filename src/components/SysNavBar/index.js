import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

/**
 * static defaultProps = {
    title: ''
  }

  height: 128px
 */
class SysNavBar extends Taro.Component {
  static defaultProps = {
    title: '',
    transparent: false,
    hideBack: false
  }

  onBack = e => {
    e.stopPropagation()
    console.log('onBack')
    Taro.navigateBack()
  }

  render() {
    const { title, transparent, hideBack } = this.props
    return (
      <View
        className='sys-nav-bar'
        style={
          transparent ? { backgroundColor: 'transparent', border: 'none' } : {}
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
