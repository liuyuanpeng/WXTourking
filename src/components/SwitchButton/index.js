import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

class SwitchButton extends Taro.Component {
  static defaultProps = {
    isRight: false,
    onChange: null
  }

  static externalClasses = ['wrap-class']

  handleClick = (isRight, e) => {
    e.stopPropagation()
    const { onChange } = this.props
    onChange && onChange(isRight)
  }

  render() {
    const { isRight } = this.props
    return (
      <View className='switch-button wrap-class' onClick={this.handleClick}>
        <View
          className={`switch-left ${isRight?'gray':''}`}
          onClick={this.handleClick.bind(this, false)}
        >
          接机站
        </View>
        <View
          className={`switch-right ${isRight?'':'gray'}`}
          onClick={this.handleClick.bind(this, true)}
        >
          送机站
        </View>
        <View className={`switch-hover ${isRight ? 'on' : 'off'}`} />
      </View>
    )
  }
}
export default SwitchButton
