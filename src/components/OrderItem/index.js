import Taro from '@tarojs/taro'
import { View, Image, Label, Button } from '@tarojs/components'
import dayjs from 'dayjs'
import ORDER_STATUS from '@constants/status'
import ORDER_TYPE from '@constants/types'

import './index.scss'

const carPng = IMAGE_HOST + '/images/car.png'
const giftPng = IMAGE_HOST + '/images/gift.png'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'

import { connect } from '@tarojs/redux'

@connect(({}) => ({}))
class OrderItem extends Taro.Component {
  static defaultProps = {
    data: {},
    showModal: false
  }

  showTransferNumber = e => {
    e.stopPropagation()
    this.setState({
      showModal: true
    })
  }
  closeModal = e => {
    e.stopPropagation()
    this.setState({
      showModal: false
    })
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
  render() {
    const { data } = this.props
    const { showModal } = this.state
    const {
      order = { scene: 'JIEJI' },
      private_consume,
      zuowei,
      chexing
    } = data
    const type = ORDER_TYPE[order.scene] || ''
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
                !order.evaluate && <View className='order-btn-red'>评价</View>}
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
              src={private_consume ? private_consume.images[0] : ''}
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
                {`时间: ${dayjs(order.start_time).format('YYYY-MM-DD')}`}
              </View>
              {type !== '伴手礼' && (
                <View className='order-template-text'>{`车型: ${chexing.name ||
                  ''}${zuowei.name || ''}`}</View>
              )}
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
              {ORDER_STATUS[order.order_status] === '已完成' && (
                <View className='order-btn' onClick={this.showTransferNumber}>
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
        <AtModal isOpened={showModal}>
          <AtModalHeader>物流编号</AtModalHeader>
          <AtModalContent>{order.id}</AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeModal}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
export default OrderItem
