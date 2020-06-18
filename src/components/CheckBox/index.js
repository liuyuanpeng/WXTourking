import Taro from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'

import './index.scss'

import checkPng from '../../asset/images/check.png'
import checkedPng from '../../asset/images/check_focus.png'

class CheckBox extends Taro.Component {
  static externalClasses = ['wrap-class']


  static defaultProps = {
    checked: false,
    onChange: null,
    title: ''
  }

  onChange = e => {
    e.stopPropagation();
    const {onChange} = this.props
    const {checked} = this.state
    onChange && onChange(!checked)
  }

  render() {
    const { checked, title } = this.props
    return (
      <View className='wrap-class'>
        <View className='check-box' onClick={this.onChange}>
        <Image className='check-box-icon' src={checked?checkedPng:checkPng} mode='aspectFill' />
        <Label className='check-box-title'>{title}</Label>
      </View>
      </View>
    )
  }
}
export default CheckBox
