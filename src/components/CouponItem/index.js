import Taro from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'

import './index.scss'
import dayjs from 'dayjs'

class CouponItem extends Taro.Component {
  static defaultProps = {
    type: 'effective', //overdue, used
    title: '',
    value: '',
    overflow: '',
    start_time: '',
    end_time: '',
    onSelect: null
  }

  handleClick = e => {
    e.stopPropagation();
    this.props.onSelect && this.props.onSelect()
  }
  render() {
    const { type, title, value, overflow, start_time, end_time } = this.props
    const isEffective = type === 'effective'
    const isOverdue = type === 'overdue'
    return (
      <View className='coupon-item' onClick={this.handleClick}>
        <View
          className={isEffective ? 'coupon-item-left' : 'coupon-item-left gray-left'}
        >
          <View className='coupon-value'>
            <Label className='coupon-value-sign'>￥</Label>
            {value}
          </View>
          <View className='coupon-overflow'>{`满${overflow}可用`}</View>
        </View>
        <View
          className={
            isEffective ? 'coupon-item-right' : 'coupon-item-right gray-right'
          }
        >
          <View className='coupon-title'>{title}</View>
          <View className='coupon-tip'>{`${dayjs(start_time).format(
            'MM月DD日'
          )}-${dayjs(end_time).format('MM月DD日')}有效`}</View>
          <View
            className={`coupon-status ${isEffective ? 'yellow' : ''}`}
            onClick={isEffective ? this.handleUse : null}
          >
            {isEffective ? '去使用' : isOverdue ? '已过期' : '已使用'}
          </View>
        </View>
      </View>
    )
  }
}
export default CouponItem
