import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image, Label } from '@tarojs/components'

import './index.scss'
import dayjs from 'dayjs'
import { debounce } from 'debounce'

class CouponItem extends React.Component {
  static defaultProps = {
    type: 'effective', //overdue, used
    name: '',
    price: '',
    limit_price: '',
    start_time: '',
    end_time: '',
    onSelect: null,
  }

  handleClick = (e) => {
    e.stopPropagation()
    this.props.onSelect && this.props.onSelect()
  }

  handleUse = (e) => {
    e.stopPropagation()
    Taro.switchTab({
      url: '../home/index',
    })
  }

  render() {
    const { type, name, price, limit_price, start_time, end_time } = this.props
    const isEffective = type === 'effective'
    const isOverdue = type === 'overdue'
    return (
      <View className='coupon-item' onClick={this.handleClick}>
        <View
          className={
            isEffective ? 'coupon-item-left' : 'coupon-item-left gray-left'
          }
        >
          <View className='coupon-value'>
            <Label className='coupon-value-sign'>￥</Label>
            {price}
          </View>
          <View className='coupon-overflow'>{`满${limit_price}可用`}</View>
        </View>
        <View
          className={
            isEffective ? 'coupon-item-right' : 'coupon-item-right gray-right'
          }
        >
          <View className='coupon-title'>{name}</View>
          {start_time && end_time ? (
            <View className='coupon-tip'>{`${dayjs(start_time).format(
              'MM月DD日'
            )}-${dayjs(end_time).format('MM月DD日')}有效`}</View>
          ) : null}
          {this.props.onSelect ? null : (
            <View
              className={`coupon-status ${isEffective ? 'yellow' : ''}`}
              onClick={isEffective ? debounce(this.handleUse, 100) : null}
            >
              {isEffective ? '去使用' : isOverdue ? '已过期' : '已使用'}
            </View>
          )}
        </View>
      </View>
    )
  }
}
export default CouponItem
