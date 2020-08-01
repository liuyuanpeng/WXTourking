import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, ScrollView, Button } from '@tarojs/components'
import NavBar from '@components/NavBar'
import '../../common/index.scss'
import './index.scss'

const daySchedulePng = IMAGE_HOST + '/images/bkg4.png'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { connect } from '@tarojs/redux'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import dayjs from 'dayjs'
import ORDER_STATUS from '@constants/status'

@connect(({ order }) => ({
  data: order.userOrder
}))
class PayProduct extends Component {
  config = {
    navigationBarTitleText: '确认订单'
  }

  state = {
    showModal: false
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
    dispatch({
      type: 'order/payOrder',
      payload: {
        id: order.id
      },
      success: () => {
        Taro.showToast({
          title: '模拟支付成功',
          icon: 'success'
        })
      },
      fail: msg => {
        Taro.showToast({
          title: msg || '模拟支付失败',
          icon: 'none'
        })
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
    const { order, consume, private_consume, chexing, zuowei } = data
    const { showModal } = this.state
    if (!order) return null
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
      air_no
    } = order

    const orderStatusDesc = ORDER_STATUS[order_status]

    const orderInfos = [
      {
        label: '订单号',
        value: id
      },
      {
        label: '乘车人',
        value: username
      },
      {
        label: '手机号',
        value: mobile
      },
      {
        label: '服务商',
        value: '旅王出行'
      }
    ]

    const isChartered =
      scene === 'JIEJI' || scene === 'SONGJI' || scene === 'DAY_PRIVATE'

    const scrollStyle = {
      top: 88 + Taro.$statusBarHeight + 'rpx',
      height: Taro.$windowHeight - 88 - Taro.$statusBarHeight + 'rpx'
    }

    return (
      <ScrollView
        className='pay-product-scroll'
        scrollY
        scrollWithAnimation
        style={scrollStyle}
      >
        <View className='pay-product'>
          <SysNavBar title='确认订单' />
          {!isChartered && (
            <View className='pay-product-header'>
              <View className='pay-product-tip'>
                您的订单尚未完成支付，请重新支付
              </View>
              <Image
                className='header-image'
                src={daySchedulePng}
                mode='aspectFill'
              />
              <View className='header-right'>
                <View className='header-title'>厦门胡里山炮台</View>
                <View className='header-subtitle'>八闽门户，天南锁钥</View>
                <View className='header-declare'>付款后司机会主动联系您</View>
                <View className='header-price'>￥{returnFloat(price)}</View>
              </View>
            </View>
          )}
          {isChartered && (
            <View className='pay-product-header-ex'>
              {(orderStatusDesc === '待付款' ||
                orderStatusDesc === '待出行') && (
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
            <View className='pay-product-pay-btn' onClick={this.handlePay}>
              继续支付
            </View>
          )}
          {!isChartered && (
            <View className='pay-product-info'>
              {(orderStatusDesc === '待付款' ||
                orderStatusDesc === '待出行') && (
                <View className='pay-product-tip'>
                  {orderStatusDesc === '待付款'
                    ? '您的订单尚未完成支付，请重新支付'
                    : `我们会在${dayjs(start_time).format(
                        'MM月DD日 HH:mm'
                      )}前确认车辆信息`}
                </View>
              )}
              <View className='pay-product-info-label'>
                {`车型:  ${chexing.name || ''}${zuowei.name || ''}`}
                <Label className='pay-product-info-luggage'>
                  {chexing.baggages}
                </Label>
              </View>
              <View className='pay-product-info-label'>{`用车时间:  ${start_time.format(
                'YYYY年MM月DD日 HH:mm'
              )}`}</View>
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
                <View className='pay-product-tourist-item-title'>
                  乘车人姓名
                </View>
                <View className='pay-product-tourist-item-value'>
                  {username}
                </View>
              </View>
              <View className='pay-product-tourist-item pay-product-tourist-item-border'>
                <View className='pay-product-tourist-item-title'>
                  乘车人手机号
                </View>
                <View className='pay-product-tourist-item-value'>{mobile}</View>
              </View>
              {scene === 'DAY_PRIVATE' && (
                <View className='pay-product-tourist-item pay-product-tourist-item-border'>
                  <View className='pay-product-tourist-item-title'>
                    包车天数
                  </View>
                  <View className='pay-product-tourist-item-value'>
                    {days}天
                  </View>
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
              <View className='pay-product-coupon-right'>已优惠15元</View>
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
        </View>

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
      </ScrollView>
    )
  }
}

export default PayProduct
