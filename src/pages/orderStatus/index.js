import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, ScrollView } from '@tarojs/components'
import '../../common/index.scss'
import './index.scss'

import { AtModal } from 'taro-ui'
import { connect } from '@tarojs/redux'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import dayjs from 'dayjs'
import ORDER_STATUS from '@constants/status'
import { debounce } from 'debounce'

@connect(({ order }) => ({
  data: order.userOrder
}))
class PayProduct extends Component {
  config = {
    navigationBarTitleText: '确认订单'
  }

  state = {
    showModal: false,
    goHome: false
  }

  componentDidMount() {
    const goHome = !!this.$router.params.goHome
    this.setState({
      goHome
    })
  }
  

  showModal = bShow => {
    this.setState({
      showModal: bShow
    })
  }

  handleClose = () => {
    this.showModal(false)
  }

  handlePay = e => {
    e.stopPropagation()
    const { data, dispatch } = this.props
    const { order } = data
    // 拉起支付
    Taro.requestPayment({
      timeStamp: order.wechat_timestamp,
      nonceStr: order.wechat_nonce_str,
      package:  'prepay_id=' + order.wechat_order_id,
      signType: 'MD5',
      paySign: order.wechat_pay_sign,
      success: () => {
        dispatch({
          type: 'order/updateUserOrder',
          payload: {
            // 付款成功修改订单状态
            order: { ...order, order_status: 'WAIT_ACCEPT' }
          }
        })
      },
      fail: () => {
        
      }
    })
  }

  handleCancel = e => {
    e.stopPropagation()
    this.showModal(true)
  }

  handleConfirm = () => {
    const { data, dispatch } = this.props
    const { order } = data
    this.showModal(false)
    dispatch({
      type: 'order/cancelOrder',
      payload: {
        id: order.id
      },
      success: () => {
        Taro.showToast({
          title: '订单取消成功',
          icon: 'none'
        })
      },
      fail: msg => {
        Taro.showToast({
          title: msg || '订单取消失败',
          icon: 'none'
        })
      }
    })
  }

  render() {
    const { data } = this.props
    const { order, private_consume, chexing, zuowei } = data
    const { showModal, goHome } = this.state
    if (!order) return null
    let productImg
    try {
      productImg = private_consume.images
        ? private_consume.images.split(',')[0]
        : ''
    } catch (error) {
      console.log('error image config')
    }
    const {
      scene,
      order_status,
      price,
      username,
      mobile,
      id,
      days,
      start_time,
      start_place,
      target_place,
      air_no,
      receive_name,
      receive_mobile,
      count,
      coupon_price
    } = order

    const orderStatusDesc = ORDER_STATUS[order_status]

    const isChartered =
      scene === 'JIEJI' || scene === 'SONGJI' || scene === 'DAY_PRIVATE'

    const isGift = scene === 'BANSHOU_PRIVATE'

    const orderInfos = [
      {
        label: '订单号',
        value: id
      },
      {
        label: isGift ? '收货人' : '乘车人',
        value: isGift ? receive_name : username
      },
      {
        label: '手机号',
        value: isGift ? receive_mobile : mobile
      },
      {
        label: '服务商',
        value: '旅王出行'
      }
    ]

    return (
      <View className='pay-product' style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}>
        <SysNavBar title='确认订单' goHome={goHome} />
        {!isChartered && (
          <View className='pay-product-header'>
            {!isGift &&
              (orderStatusDesc === '待付款' ||
                orderStatusDesc === '待出行') && (
                <View className='pay-product-tip'>
                  {orderStatusDesc === '待付款'
                    ? '您的订单尚未完成支付，请重新支付'
                    : `我们会在${dayjs(start_time).format(
                        'MM月DD日 HH:mm'
                      )}前确认车辆信息`}
                </View>
              )}
            <Image
              className='header-image'
              src={productImg}
              mode='aspectFill'
            />
            <View className='header-right'>
              <View className='header-title'>{private_consume.name}</View>
              <View className='header-subtitle'>{private_consume.tag}</View>
              {isGift ? (
                <View className='header-price'>数量: x{count || 1}</View>
              ) : (
                <View className='header-declare'>付款后司机会主动联系您</View>
              )}
              <View className='header-price'>￥{returnFloat(price)}</View>
            </View>
          </View>
        )}
        {isChartered && (
          <View className='pay-product-header-ex'>
            {(orderStatusDesc === '待付款' || orderStatusDesc === '待出行') && (
              <View className='pay-product-tip'>
                {orderStatusDesc === '待付款'
                  ? '您的订单尚未完成支付，请重新支付'
                  : `我们会在${dayjs(start_time).format(
                      'MM月DD日 HH:mm'
                    )}前确认车辆信息`}
              </View>
            )}
            <View className='pay-product-header-ex-price'>
              ￥{returnFloat(price)}
            </View>
            <View className='pay-product-header-ex-title'>
              {chexing.name || ''}
              {zuowei.name || ''}
            </View>
            {scene !== 'DAY_PRIVATE' && (
              <View className='pay-product-header-ex-subtitle'>{`${air_no} 航班实际到达后用车`}</View>
            )}
            <View className='pay-product-header-ex-place'>
              <View className='pay-product-header-ex-place-start'>
                {start_place}
              </View>
              <View className='pay-product-header-ex-place-target'>
                {target_place}
              </View>
            </View>
          </View>
        )}
        {orderStatusDesc === '待付款' && (
          <View className='pay-product-pay-btn' onClick={debounce(this.handlePay, 100)}>
            继续支付
          </View>
        )}
        {!isChartered && !isGift && (
          <View className='pay-product-info'>
            <View className='pay-product-info-label'>
              {`车型:  ${chexing.name || ''}${zuowei.name || ''}`}
              <Label className='pay-product-info-luggage'>
                {chexing.baggages}
              </Label>
            </View>
            <View className='pay-product-info-label'>{`用车时间:  ${dayjs(
              start_time
            ).format('YYYY年MM月DD日 HH:mm')}`}</View>
            <View className='pay-product-info-label'>{`上车地点:  ${start_place}`}</View>
          </View>
        )}
        {!isChartered && (
          <View className='pay-product-passenger'>
            {orderInfos.map((item, index) => (
              <View
                className={`pay-product-passenger-item${
                  index > 0 ? ' pay-product-passenger-split-line' : ''
                }`}
                key={`pay-product-passenger-item-${index}`}
              >
                <Label className='pay-product-passenger-item-label'>
                  {item.label}
                </Label>
                <Label className='pay-product-passenger-item-value'>
                  {item.value}
                </Label>
              </View>
            ))}
          </View>
        )}
        {isChartered && (
          <View className='pay-product-tourist'>
            <View className='pay-product-tourist-item'>
              <View className='pay-product-tourist-item-title'>乘车人姓名</View>
              <View className='pay-product-tourist-item-value'>{username}</View>
            </View>
            <View className='pay-product-tourist-item pay-product-tourist-item-border'>
              <View className='pay-product-tourist-item-title'>
                乘车人手机号
              </View>
              <View className='pay-product-tourist-item-value'>{mobile}</View>
            </View>
            {scene === 'DAY_PRIVATE' && (
              <View className='pay-product-tourist-item pay-product-tourist-item-border'>
                <View className='pay-product-tourist-item-title'>包车天数</View>
                <View className='pay-product-tourist-item-value'>{days}天</View>
              </View>
            )}
            <View className='pay-product-tourist-item pay-product-tourist-item-border'>
              <View className='pay-product-tourist-item-title'>用车时间</View>
              <View className='pay-product-tourist-item-value'>
                {dayjs(start_time).format('YYYY年MM月DD日')}
              </View>
              <View className='pay-product-tourist-item-time-icon' />
            </View>
          </View>
        )}
        {/* 优惠券 */}
        {orderStatusDesc === '待付款' && (
          <View className='pay-product-coupon'>
            <View className='pay-product-coupon-title'>优惠券</View>
        <View className='pay-product-coupon-right'>已优惠{coupon_price || 0}元</View>
          </View>
        )}
        {/* 发票 */}
        {orderStatusDesc === '已完成' && (
          <View className='pay-product-bill'>
            <View className='pay-product-bill-title'>发票</View>
            <View className='pay-product-bill-right'>去开发票</View>
          </View>
        )}
        {(orderStatusDesc === '待出行' || orderStatusDesc === '待付款') && (
          <View className='pay-product-cancel-btn' onClick={this.handleCancel}>
            取消订单
          </View>
        )}
        <AtModal
          isOpened={showModal}
          title='取消订单'
          cancelText='取消'
          confirmText='确定'
          onClose={this.handleClose}
          onCancel={this.handleClose}
          onConfirm={this.handleConfirm}
          content='确定取消该订单吗？'
        />
      </View>
    )
  }
}

export default PayProduct
