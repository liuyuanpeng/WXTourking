import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image, Label } from '@tarojs/components'

import './index.scss'

class ProductItem extends React.Component {
  static defaultProps = {
    type: 'scene', // scene, food, gift
    image: '',
    title: '',
    pointDesc: '',
    pointTail: '',
    subtitle: '',
    endTitle: '',
    price: 0
  }

  handleClick = e => {
    e.stopPropagation();
    this.props.onClick && this.props.onClick(e)
  }

  render() {
    const {
      type,
      image,
      title,
      pointDesc,
      pointTail,
      subtitle,
      endTitle,
      price
    } = this.props
    return (
      <View className='list-item' onClick={this.handleClick}>
        <Image className='list-item-image' src={image} mode='aspectFill' />
        <View className='intro'>
          <View className='product-item-title'>
            <Label>{title}</Label>
          </View>
          <View className='intro-item'>
            <Label className='point'>{pointDesc}</Label>
            <Label className='tail'>{` | `}</Label>
            <Label className='tail'>{pointTail}</Label>
          </View>
          <View className='intro-item'>
            <Label className='gray'>{subtitle}</Label>
          </View>
          {type === 'gift' ? (
            <View className='intro-price'>
              <Label className='price'>{price}</Label>
              <Label className='qi'>起</Label>
            </View>
          ) : (
            <View className='intro-item'>
              <Label className='gray'>{endTitle}</Label>
            </View>
          )}
        </View>
      </View>
    )
  }
}
export default ProductItem
