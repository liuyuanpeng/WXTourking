import Taro from '@tarojs/taro'
import React from 'react'
import { View, Label } from '@tarojs/components'

import './index.scss'

class DecorateTitle extends React.Component {
  static defaultProps = {
    isGift: false,
    image: '',
    title: '',
    pointDesc: '',
    pointTail: '',
    subtitle: '',
    endTitle: '',
    price: 0
  }

  render() {
    const {
      title = ''
    } = this.props
    return (
      <View className='decorate-title'>
       <View className='dot'></View>
    <Label className='guess-text'>{title}</Label>
      </View>
    )
  }
}
export default DecorateTitle
