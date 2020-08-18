import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber, AtInput } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import DateTimePicker from '@components/DateTimePicker'
import LocationInput from '@components/LocationInput'
import STORAGE from '@constants/storage'

import QQMapWX from '../utilPages/location/qqmap'
import dayjs from 'dayjs'

let qqMapSDK = null

@connect(({ city }) => ({
  currentCity: city.current
}))
class PayProduct extends Component {
  config = {
    navigationBarTitleText: '订单支付'
  }

  state = {
    order: {},
    start_place: { title: '' },
    name: '',
    phone: '',
    start_time: dayjs().add(1, 'day'),
    price: 0
  }

  componentDidMount() {
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('orderData', data => {
      this.setState({
        order: data
      })
    })
    const name = Taro.getStorageSync(STORAGE.ORDER_USER_NAME) || ''
    const phone = Taro.getStorageSync(STORAGE.ORDER_USER_MOBILE) || ''
    this.setState({
      name,
      phone
    })
  }

  onMoreAddress = e => {
    e.stopPropagation()
    console.log('onMoreAddress')
  }

  getDistance = params => {
    qqMapSDK = new QQMapWX({
      key: 'JTKBZ-LCG6U-GYOVE-BJMJ5-E3DA5-HTFAJ' // 必填
    })
    const { from, to, success } = params
    qqMapSDK.calculateDistance({
      mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      from, //若起点有数据则采用起点坐标，若为空默认当前地址
      to, //终点坐标
      success: res => {
        //成功后的回调

        if (res.status == 0 && res.result.elements.length > 0) {
          this.kilo = res.result.elements[0].distance
          ;(this.time = res.result.elements[0].duration),
            success && success({ kilo: this.kilo, time: this.time })
        }
      },
      fail: function(error) {
        console.error(error)
      }
    })
  }

  handleChange = value => {
    this.setState({
      count: value
    })
  }

  handlePay = e => {
    e.stopPropagation()
    let msg = ''
    const { start_place, start_time, phone, name, order, price } = this.state
    const regex = /^(13|14|15|16|17|18|19)\d{9}$/
    if (start_time.isBefore(dayjs())) {
      msg = '输入的时间过期了'
    } else if (!name) {
      msg = '请输入姓名'
    } else if (!phone || !regex.test(phone)) {
      msg = '请输入正确的手机号'
    } else if (
      !start_place.latitude ||
      !start_place.longitude ||
      !start_place.title
    ) {
      msg = '请输入上车地点'
    }
    if (msg) {
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    
    const {
      scene,
      city_id,
      air_no = '',
      target_place,
      chexing,
      zuowei,
      consume,
      days = 1,
      private_consume
    } = order

    const payload = {
      user_id: Taro.getStorageSync(STORAGE.USER_ID),
      user_mobile: Taro.getStorageSync(STORAGE.USER_PHONE),
      open_id: Taro.getStorageSync(STORAGE.OPEN_ID),
      scene,
      common_scene: 'ORDER',
      city_id,
      chexing_id: chexing.id,
      zuowei_id: zuowei.id,
      price,
      start_time: start_time.valueOf(),
      kilo: this.kilo,
      time: this.time,
      air_no,
      days,
      start_place: start_place.title,
      start_latitude: start_place.latitude,
      start_longitude: start_place.longitude,
      target_place: target_place.title,
      target_latitude: target_place.latitude,
      target_longitude: target_place.longitude,
      mobile: phone,
      order_source: 'USER',
      consume_id: consume.id,
      private_consume_id: private_consume.id,
      username: name
    }
    this.props.dispatch({
      type: 'order/createOrder',
      payload,
      success: result => {
        // 存储手机号和用户名
        Taro.setStorageSync(STORAGE.ORDER_USER_NAME, name)
        Taro.setStorageSync(STORAGE.ORDER_USER_MOBILE, phone)
        // 拉起支付

        this.props.dispatch({
          type: 'order/setUserOrder',
          payload: {
            order: {...result},
            chexing,
            zuowei,
            consume,
            private_consume
          },
          success: ()=>{
            Taro.navigateTo({
              url: '../orderStatus/index'
            })
          }
        })
      },
      fail: message => {
        Taro.showToast({
          title: message || '创建订单失败',
          icon: 'none'
        })
      }
    })
  }

  timeAction = e => {
    e.stopPropagation()
    console.log('timeAction')
  }

  getPrice = options => {
    this.props.dispatch({
      type: 'order/getPrice',
      ...options
    })
  }

  handleLocationChange = location => {
    this.setState({
      start_place: location
    })
    const { start_time, order } = this.state
    const { price_strategy_id = {}, target_place } = order
    if (
      location.latitude &&
      location.longitude &&
      target_place.latitude &&
      target_place.longitude
    ) {
      this.getDistance({
        from: location.latitude + ',' + location.longitude,
        to: target_place.latitude + ',' + target_place.longitude,
        success: ({ kilo, time }) => {
          start_time &&
            this.getPrice({
              payload: {
                start_time: start_time.valueOf(),
                kilo,
                time,
                price_strategy_id
              },
              success: finalPrice => {
                this.setState({
                  price: finalPrice
                })
              },
              fail: () => {
                Taro.showToast({
                  title: '无法获取订单价格',
                  icon: 'none'
                })
              }
            })
        }
      })
    }
  }

  handleChangeTime = value => {
    this.setState({
      start_time: value
    })
    const { order } = this.state
    const { price_strategy_id } = order
    if (this.kilo && this.time) {
      this.getPrice({
        payload: {
          start_time: value.valueOf(),
          kilo: this.kilo,
          time: this.time,
          price_strategy_id
        },
        success: finalPrice => {
          this.setState({
            price: finalPrice
          })
        },
        fail: () => {
          Taro.showToast({
            title: '无法获取订单价格',
            icon: 'none'
          })
        }
      })
    }
  }

  render() {
    const {
      start_place = '厦门市思明区',
      name,
      phone,
      start_time,
      price,
      order
    } = this.state
    const { private_consume = {} } = order
    let productImg
    try {
      productImg = private_consume.images ? private_consume.images.split(',')[0] : ''
    } catch (error) {
      
    }
    return (
      <View
        className='pay-product'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='订单支付' />
        <View className='pay-product-header'>
          <Image
            className='header-image'
            src={productImg}
            mode='aspectFill'
          />
          <View className='header-right'>
            <View className='header-title'>{private_consume.name}</View>
            <View className='header-subtitle'>{private_consume.tag}</View>
            <View className='header-declare'>付款后司机会主动联系您</View>
            <View className='header-price'>￥{returnFloat(price)}</View>
          </View>
        </View>
        <View className='pay-product-detail'>
          <View className='detail-item'>
            <View className='detail-label'>上车地点</View>
            <LocationInput
              wrap-class='detail-content'
              title={start_place.title}
              placeholder='请选择上车地点'
              onChange={this.handleLocationChange}
            />
            <View className='location-icon' onClick={this.onLocate}></View>
          </View>
          <View className='detail-split' />
          <View className='detail-item'>
            <View className='detail-label'>乘车人姓名</View>
            <AtInput
              className='detail-input'
              value={name}
              placeholder='请输入姓名'
            />
          </View>
          <View className='detail-split' />
          <View className='detail-item'>
            <View className='detail-label'>乘车人手机号</View>
            <AtInput
              type='phone'
              className='detail-input'
              value={phone}
              placeholder='请输入手机号'
            />
          </View>
          <View className='detail-split' />
          <View className='detail-item' onClick={this.timeAction}>
            <View className='detail-label'>用车时间</View>
            <DateTimePicker
              wrap-class='detail-content'
              onOk={this.handleChangeTime}
              hidePassed
              initValue={start_time}
              placeholder='请选择日期'
            />
            <View className='time-icon'></View>
          </View>
        </View>
        <View className='pay-gift-footer'>
          <Label className='pay-it' onClick={this.handlePay}>
            立即支付
          </Label>
          <Label className='total-footer'>{`￥${returnFloat(price)}`}</Label>
          <Label className='sum-text'>合计：</Label>
        </View>
      </View>
    )
  }
}

export default PayProduct
