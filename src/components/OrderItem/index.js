import Taro from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'
import dayjs from 'dayjs'
import ORDER_STATUS from '../../constants/status'
import ORDER_TYPE from '../../constants/types'

import './index.scss'

import carPng from '../../asset/images/car.png'
import giftPng from '../../asset/images/gift.png'

class OrderItem extends Taro.Component {
  static defaultProps = {
    data: {}
  }

  render() {
    const { data } = this.props
    console.log('item data:', data)
    const type = ORDER_TYPE[data.scene] || ''
    return (
      <View className='order-item'>
        <Image
          className='order-item-icon'
          src={type === '伴手礼' ? giftPng : carPng}
          mode='aspectFill'
        />
        <View className='order-item-type-text'>{type}</View>
        <View className='order-item-status-text'>{ORDER_STATUS[data.status]}</View>
        {data.scene === 'JIEJI' || data.scene === 'SONGJI' || type === '按天包车' ? (
          <View className='order-normal'>
            <View className='order-normal-title'>{`${data.start_place}-${data.target_place ? data.target_place : '无'}`}</View>
            {data.day && (
              <View className='order-normal-text'>{`包车天数${data.day}天`}</View>
            )}
            <View className='order-normal-text'>{`用车时间:${dayjs(
              data.start_time
            ).format('YYYY-MM-DD')}`}</View>
            <View className='order-normal-text'>
              {`车型:${data.car.type}${data.car.sit}座`}
            </View>
            <View className='order-price'>
              合计
              <Label className='order-price-total'>{`￥ ${data.price}`}</Label>
            </View>
            <View className='order-buttons'>
              {data.status === 'done' && (
                <View className='order-btn-red'>评价</View>
              )}
            </View>
          </View>
        ) : (
          <View className='order-template'>
            <Image
              className='order-template-image'
              src={data.template.image}
              mode='aspectFill'
            />
            <View className='order-template-detail'>
              <View className='order-template-title'>
                {data.template.title}
              </View>
              {data.day && (
                <View className='order-template-text'>{`包车天数${data.day}天`}</View>
              )}
              {data.count && (
                <View className='order-template-text'>{`商品数量: x${data.count}`}</View>
              )}
              <View className='order-template-text'>
                {type === '伴手礼' ? '下单' : '用车'}
                {`时间: ${dayjs(data.start_time).format('YYYY-MM-DD')}`}
              </View>
              {type !== '伴手礼' && (
              <View className='order-template-text'>{`车型: ${data.car.type}${data.car.sit}座`}</View>
            )}
            </View>
            
            <View className='order-price'>
              合计
              <Label className='order-price-total'>{`￥ ${data.price}`}</Label>
            </View>
            <View className='order-buttons'>
              {data.status === 'wait_for_go' && (
                <View className='order-btn'>取消订单</View>
              )}
              {data.status === 'sending' && (
                <View className='order-btn'>查看物流编号</View>
              )}
              {data.status === 'wait_for_pay' && (
                <View className='order-btn-red'>去付款</View>
              )}
              {data.status === 'wait_for_pay' && (
                <View className='order-btn'>取消订单</View>
              )}
            </View>
          </View>
        )}
      </View>
    )
  }
}
export default OrderItem
