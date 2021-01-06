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

@connect(({ city, address }) => ({
  currentCity: city.current,
  defaultAddress: address.defaultAddress,
  addresses: address.list
}))
class PayGift extends Component {
  config = {
    navigationBarTitleText: '订单支付'
  }

  state = {
    count: 1,
    address: this.props.defaultAddress,
    data: {}
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

  componentWillMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'address/getUserAddress',
      success: data => {
        if (data) {
          const address = data.find(item => item.set_default)
          this.setState({
            address
          })
        }
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

  onMoreAddress = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `../address/index?mode=select`
    })
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
    const { dispatch, currentCity } = this.props
    const { data, count, address } = this.state
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
    dispatch({
      type: 'order/createOrder',
      payload,
      success: result => {
        dispatch({
          type: 'order/setUserOrder',
          payload: {
            order: { ...result },
            private_consume: data
          },
          success: () => {
            Taro.navigateTo({
              url: '../orderStatus/index'
            })
          }
        })
      }
    })
  }

  render() {
    const { count, address, data } = this.state
    let giftImg
    try {
      const images = data.images.split(',')
      if (images && images.length) {
        giftImg = images[0]
      }
    } catch (error) {}
    return (
      <View
        className='pay-gift'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='订单支付' />
        {address && address.id ? (
          <View className='address' onClick={this.onMoreAddress}>
            <View className='address-icon' />
            <View className='address-details'>
              <Label className='name'>{address.name}</Label>
              <Label className='phone'>{address.mobile}</Label>
              <View className='address-text'>{address.address}</View>
            </View>
            <View className='more-address' />
          </View>
        ) : (
          <View className='address-btn' onClick={this.onMoreAddress}>
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
        <View className='pay-gift-footer'>
          <Label className='pay-it' onClick={this.handlePay}>
            立即支付
          </Label>
          <Label className='total-footer'>{`￥${returnFloat(
            data.price * count
          )}`}</Label>
          <Label className='sum-text'>合计：</Label>
          <Label className='sum-footer'>{`共${count}件，`}</Label>
        </View>
      </View>
    )
  }
}

export default PayGift
