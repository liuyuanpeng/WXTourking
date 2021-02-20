import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, SwiperItem } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import STORAGE from '@constants/storage'
import { debounce } from 'debounce'
import { checkLogin, isLogin } from '../../utils/tool'

@connect(({ city, address, coupon }) => ({
  currentCity: city.current,
  defaultAddress: address.defaultAddress,
  addresses: address.list,
  usableList: coupon.usableList
}))
class PayGift extends Component {
  config = {
    navigationBarTitleText: '订单支付'
  }

  state = {
    count: 1,
    address: this.props.defaultAddress,
    data: {},
    coupon: ''
  }

  componentWillReceiveProps(nextProps) {
    const addresses = nextProps.addresses
    if (!this.state.address) return
    const addressId = this.state.address.id
    const newAddress = addresses.find(address => address.id === addressId)
    this.setState({
      address: newAddress || nextProps.defaultAddress
    })
  }

  componentDidShow() {
    if (!isLogin()) {
      return
    }
    const { dispatch } = this.props
    dispatch({
      type: 'address/getUserAddress',
      success: data => {
        if (data) {
          const address = data.find(item => item.set_default)
          this.setState({
            address: address || {}
          })
        }
      }
    })
    const { price } = this.state.data
    // 获取可用优惠券
    this.props.dispatch({
      type: 'coupon/getUsableCoupon',
      payload: {
        price: price || 0,
        user_id: Taro.getStorageSync(STORAGE.USER_ID)
      }
    })
  }

  componentDidMount() {
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('giftData', data => {
      this.setState({
        data
      })
    })
  }

  goToCoupon = e => {
    e.stopPropagation()
    if (checkLogin()) {
      const { data, count } = this.state
      Taro.navigateTo({
        url: '../coupon/index?canEdit=true&price=' + data.price * count,
        events: {
          acceptCoupon: coupon => {
            this.setState({
              coupon
            })
          }
        }
      })
    }
  }

  onMoreAddress = e => {
    e.stopPropagation()
    if (checkLogin()) {
      Taro.navigateTo({
        url: `../address/index?mode=select`
      })
    }
  }

  selectAddress = address => {
    this.setState({ address })
  }

  handleChange = value => {
    this.setState({
      count: value
    })
  }

  handlePay = e => {
    e.stopPropagation()
    if (!checkLogin()) {
      return
    }
    const { dispatch, currentCity } = this.props
    const { data, count, address, coupon } = this.state
    if (!address || !address.id) {
      Taro.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }
    const payload = {
      user_id: Taro.getStorageSync(STORAGE.USER_ID),
      user_mobile: Taro.getStorageSync(STORAGE.USER_PHONE),
      open_id: Taro.getStorageSync(STORAGE.OPEN_ID),
      scene: 'BANSHOU_PRIVATE',
      common_scene: 'ORDER',
      city_id: currentCity.id,
      count,
      price: data.price * count,
      total_price: data.price * count,
      receive_mobile: address.mobile,
      private_consume_id: data.id,
      order_source: 'USER',
      receive_name: address.name,
      receive_address: address.address,
      mobile: address.mobile,
      username: address.name
    }

    // 使用优惠券信息
    if (coupon && coupon.id) {
      payload.coupon_id = coupon.id
      payload.coupon_price = coupon.price
      payload.price -= payload.coupon_price
    }

    if (payload.price <= 0) return

    const sourceShopId = Taro.getStorageSync(STORAGE.SOURCE_SHOP_ID)
    if (sourceShopId) {
      payload.source_shop_id = sourceShopId
    }

    const sourceDriverId = Taro.getStorageSync(STORAGE.SOURCE_DRIVER_ID)
    if (sourceDriverId) {
      payload.source_driver_id = sourceDriverId
    }

    dispatch({
      type: 'order/createOrder',
      payload,
      success: result => {

        Taro.setStorageSync(STORAGE.SOURCE_SHOP_ID, 0)
        Taro.setStorageSync(STORAGE.SOURCE_DRIVER_ID, 0)
        
        // 拉起支付
        Taro.requestPayment({
          timeStamp: result.wechat_timestamp,
          nonceStr: result.wechat_nonce_str,
          package: 'prepay_id=' + result.wechat_order_id,
          signType: 'MD5',
          paySign: result.wechat_pay_sign,
          success: () => {
            dispatch({
              type: 'order/setUserOrder',
              payload: {
                // 付款成功修改订单状态
                order: { ...result, order_status: 'WAIT_ACCEPT' },
                private_consume: data
              },
              success: () => {
                Taro.navigateTo({
                  url: '../orderStatus/index?goHome=true'
                })
              }
            })
          },
          fail: () => {
            dispatch({
              type: 'order/setUserOrder',
              payload: {
                order: { ...result },
                private_consume: data
              },
              success: () => {
                Taro.navigateTo({
                  url: '../orderStatus/index?goHome=true'
                })
              }
            })
          }
        })
      }
    })
  }

  render() {
    const { count, address, data, coupon } = this.state
    const { usableList } = this.props
    let giftImg
    try {
      const images = data.images.split(',')
      if (images && images.length) {
        giftImg = images[0]
      }
    } catch (error) {}

    const couponClassName =
      usableList && usableList.length
        ? 'coupon-right'
        : 'coupon-right coupon-right-gray'
    return (
      <View
        className='pay-gift'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='订单支付' />
        {address && address.id ? (
          <View className='address' onClick={debounce(this.onMoreAddress, 100)}>
            <View className='address-icon' />
            <View className='address-details'>
              <Label className='name'>{address.name}</Label>
              <Label className='phone'>{address.mobile}</Label>
              <View className='address-text'>{address.address}</View>
            </View>
            <View className='more-address' />
          </View>
        ) : (
          <View
            className='address-btn'
            onClick={debounce(this.onMoreAddress, 100)}
          >
            去新增收货地址
          </View>
        )}
        <View className='gift-container'>
          <Image className='gift-image' mode='aspectFill' src={giftImg} />
          <View className='gift-detail'>
            <View className='gift-name'>{data.name}</View>
            <View className='gift-subtitle'>{data.tag}</View>
            <View className='gift-transport'>付款后三天内发货</View>
            <View className='gift-price'>
              ￥{data.price}{' '}
              <View className='gift-count-minus'>{`×${count}`}</View>
            </View>
          </View>
          <View className='gift-count'>
            购买数量
            <AtInputNumber
              className='input-number'
              disabledInput
              min={1}
              value={count}
              onChange={this.handleChange}
            />
          </View>
          <View className='summary'>
            <Label className='sum'>{`共${count}件`}</Label>
            小计:
            <Label className='total'>{`￥${returnFloat(
              data.price * count
            )}`}</Label>
          </View>
        </View>
        <View className='coupon-container'>
          <View className='title-label'>优惠券</View>
          {/* <View className='subtitle-label'>增值税发票不享受优惠</View> */}
          <View
            className={couponClassName}
            onClick={debounce(this.goToCoupon, 100)}
          >
            {coupon
              ? `-${coupon.price}￥`
              : usableList && usableList.length
              ? `${usableList.length}张优惠券`
              : '无可用优惠券'}
          </View>
        </View>

        <View className='pay-gift-footer'>
          <Label className='pay-it' onClick={debounce(this.handlePay, 200)}>
            立即支付
          </Label>
          <Label className='total-footer'>{`￥${returnFloat(
            data.price * count - (coupon ? coupon.price : 0)
          )}`}</Label>
          <Label className='sum-text'>合计：</Label>
          <Label className='sum-footer'>{`共${count}件，`}</Label>
        </View>
      </View>
    )
  }
}

export default PayGift
