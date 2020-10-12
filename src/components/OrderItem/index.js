import Taro from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'
import dayjs from 'dayjs'
import ORDER_STATUS from '@constants/status'
import ORDER_TYPE from '@constants/types'

import './index.scss'

const carPng = IMAGE_HOST + '/images/car.png'
const giftPng = IMAGE_HOST + '/images/gift.png'

import { connect } from '@tarojs/redux'

@connect(({}) => ({}))
class OrderItem extends Taro.Component {
  static defaultProps = {
    data: {},
    showModalMsg: null
  }

  showTransferNumber = (express_number, e) => {
    e.stopPropagation()
    const {showModalMsg} = this.props
    showModalMsg && showModalMsg(express_number)
  }

  goToDetail = e => {
    e.stopPropagation()
    const { dispatch, data } = this.props
    dispatch({
      type: 'order/setUserOrder',
      payload: data,
      success: () => {
        Taro.navigateTo({
          url: '../../pages/orderStatus/index'
        })
      }
    })
  }

  goToEvaluate = e => {
    e.stopPropagation();
    const {data} = this.props
    Taro.navigateTo({
      url: '../../pages/evaluate/index',
      success: res => {
        res.eventChannel.emit('acceptEvaluate', {
          data
        })
      }
    })
  }
  render() {
    const { data } = this.props
    const {
      order = { scene: 'JIEJI' },
      private_consume = {},
      zuowei,
      chexing
    } = data
    const type = ORDER_TYPE[order.scene] || ''
    let productImg
    try {
      productImg =
        private_consume && private_consume.images
          ? private_consume.images.split(',')[0]
          : ''
    } catch (error) {
      console.log(error)
    }
    return (
      <View className='order-item'>
        <Image
          className='order-item-icon'
          src={type === '伴手礼' ? giftPng : carPng}
          mode='aspectFill'
        />
        <View className='order-item-type-text'>{type}</View>
        <View className='order-item-status-text'>
          {ORDER_STATUS[data.status]}
        </View>
        {order.scene === 'JIEJI' ||
        order.scene === 'SONGJI' ||
        type === '按天包车' ? (
          <View className='order-normal'>
            <View className='order-normal-title'>{`${order.start_place}-${
              order.target_place ? order.target_place : '无'
            }`}</View>
            {order.day && (
              <View className='order-normal-text'>{`包车天数${order.day}天`}</View>
            )}
            <View className='order-normal-text'>{`用车时间:${dayjs(
              order.start_time
            ).format('YYYY-MM-DD')}`}</View>
            <View className='order-normal-text'>
              {`车型:${chexing.name || ''}${zuowei.name || ''}`}
            </View>
            <View className='order-price'>
              合计
              <Label className='order-price-total'>{`￥ ${order.price}`}</Label>
            </View>
            <View className='order-buttons'>
              {(ORDER_STATUS[order.order_status] === '待出行' ||
                ORDER_STATUS[order.order_status] === '待付款') && (
                <View className='order-btn' onClick={this.goToDetail}>
                  取消订单
                </View>
              )}
              {ORDER_STATUS[order.order_status] === '已完成' &&
                !order.evaluate && <View className='order-btn-red' onClick={this.goToEvaluate}>评价</View>}
              {ORDER_STATUS[order.order_status] === '待付款' && (
                <View className='order-btn-red' onClick={this.goToDetail}>
                  去付款
                </View>
              )}
            </View>
          </View>
        ) : (
          <View className='order-template'>
            <Image
              className='order-template-image'
              src={productImg}
              mode='aspectFill'
            />
            <View className='order-template-detail'>
              <View className='order-template-title'>
                {private_consume ? private_consume.name : ''}
              </View>
              {private_consume && private_consume.days > 0 && (
                <View className='order-template-text'>{`包车天数${private_consume.days}天`}</View>
              )}
              {private_consume && private_consume.count > 0 && (
                <View className='order-template-text'>{`商品数量: x${private_consume.count}`}</View>
              )}
              <View className='order-template-text'>
                {type === '伴手礼' ? '下单' : '用车'}
                {`时间: ${dayjs(type==='伴手礼' ? order.create_time : order.start_time).format('YYYY-MM-DD')}`}
              </View>
              {type !== '线路包车' && type !== '伴手礼' && (
                <View className='order-template-text'>{`车型: ${chexing.name ||
                  ''}${zuowei.name || ''}`}</View>
              )}
            </View>

            <View className='order-price'>
              合计
              <Label className='order-price-total'>{`￥ ${order.price}`}</Label>
            </View>
            <View className='order-buttons'>
            {ORDER_STATUS[order.order_status] === '已完成' &&
                !order.evaluate && <View className='order-btn-red' onClick={this.goToEvaluate}>评价</View>}
              {(ORDER_STATUS[order.order_status] === '待出行' ||
                ORDER_STATUS[order.order_status] === '待付款') && (
                <View className='order-btn' onClick={this.goToDetail}>
                  取消订单
                </View>
              )}
              {order.scene === 'BANSHOU_PRIVATE' && (ORDER_STATUS[order.order_status] === '已完成' || ORDER_STATUS[order.order_status] === '进行中') && (
                <View className='order-btn' onClick={this.showTransferNumber.bind(this, order.express_number)}>
                  查看物流编号
                </View>
              )}
              {ORDER_STATUS[order.order_status] === '待付款' && (
                <View className='order-btn-red' onClick={this.goToDetail}>
                  去付款
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    )
  }
}
export default OrderItem
