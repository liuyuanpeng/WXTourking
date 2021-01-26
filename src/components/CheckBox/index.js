import Taro from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'

import './index.scss'

const checkPng = IMAGE_HOST + '/images/check.png'
const checkedPng = IMAGE_HOST + '/images/check_focus.png'

class CheckBox extends Taro.Component {
  static externalClasses = ['wrap-class', 'text-class']


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
        <Label className='check-box-title text-class'>{title}</Label>
      </View>
      </View>
    )
  }
}
export default CheckBox
