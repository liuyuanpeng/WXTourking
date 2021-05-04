import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image, Label } from '@tarojs/components'

import './index.scss'

const checkPng = IMAGE_HOST + '/images/check.png'
const checkedPng = IMAGE_HOST + '/images/check_focus.png'

class CheckBox extends React.Component {
  static defaultProps = {
    checked: false,
    onChange: null,
    title: '',
    wrapClass: '',
    textClass: ''
  }

  onChange = e => {
    e.stopPropagation();
    const {onChange, checked} = this.props
    onChange && onChange(!checked)
  }

  render() {
    const { checked, title, wrapClass, textClass } = this.props
    return (
      <View className={wrapClass}>
        <View className='check-box' onClick={this.onChange}>
        <Image className='check-box-icon' src={checked?checkedPng:checkPng} mode='aspectFill' />
        <Label className={`check-box-title ${textClass}`}>{title}</Label>
      </View>
      </View>
    )
  }
}
export default CheckBox
