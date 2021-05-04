import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, Label, ScrollView } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from 'react-redux'
import '../../common/index.scss'
import './index.scss'
import styles from './index.module.scss'

import { AtDivider, AtNavBar, AtInputNumber, AtInput, AtModal } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import DateTimePicker from '@components/DateTimePicker'
import LocationInput from '@components/LocationInput'
import STORAGE from '@constants/storage'

import QQMapWX from '../utilPages/location/qqmap'
import dayjs from 'dayjs'
import { debounce } from 'debounce'
import { checkLogin, isLogin } from '../../utils/tool'

let qqMapSDK = null

@connect(({ city, coupon }) => ({
  currentCity: city.current,
  usableList: coupon.usableList,
}))
class PayProduct extends Component {
  config = {
    navigationBarTitleText: '订单支付',
  }

  state = {
    order: {},
    start_place: { title: '' },
    name: '',
    phone: '',
    start_time: dayjs().add(5, 'm'),
    price: 0,
    coupon: '',
    showTip: false,
  }

  componentDidShow() {
    if (isLogin()) {
      const { price } = this.state.order
      this.props.dispatch({
        type: 'coupon/getUsableCoupon',
        payload: {
          price: price || 0,
          user_id: Taro.getStorageSync(STORAGE.USER_ID),
        },
      })
    }
  }

  componentDidMount() {
    const eventChannel = Taro.getCurrentInstance().page.getOpenerEventChannel()
    eventChannel.on('orderData', (data) => {
      this.setState({
        order: data,
      })
    })
    const name = Taro.getStorageSync(STORAGE.ORDER_USER_NAME) || ''
    const phone = Taro.getStorageSync(STORAGE.ORDER_USER_MOBILE) || ''
    this.setState({
      name,
      phone,
    })
  }

  goToCoupon = (e) => {
    e.stopPropagation()
    if (checkLogin()) {
      Taro.navigateTo({
        url: '../coupon/index?canEdit=true&price=' + this.state.order.price,
        events: {
          acceptCoupon: (coupon) => {
            this.setState({
              coupon,
            })
          },
        },
      })
    }
  }

  onMoreAddress = (e) => {
    e.stopPropagation()
  }

  getDistance = (params) => {
    qqMapSDK = new QQMapWX({
      key: 'JTKBZ-LCG6U-GYOVE-BJMJ5-E3DA5-HTFAJ', // 必填
    })
    const { from, to, success } = params
    qqMapSDK.calculateDistance({
      mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      from, //若起点有数据则采用起点坐标，若为空默认当前地址
      to, //终点坐标
      success: (res) => {
        //成功后的回调

        if (res.status == 0 && res.result.elements.length > 0) {
          this.kilo = res.result.elements[0].distance
          ;(this.time = res.result.elements[0].duration),
            success && success({ kilo: this.kilo, time: this.time })
        }
      },
      fail: function(error) {
        console.error(error)
      },
    })
  }

  handlePay = (e) => {
    e.stopPropagation()
    if (!checkLogin()) {
      return
    }
    let msg = ''
    const {
      start_place,
      start_time,
      phone,
      name,
      order,
      price,
      coupon,
    } = this.state
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
        icon: 'none',
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
      private_consume,
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
      total_price: price,
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
      username: name,
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

    this.props.dispatch({
      type: 'order/createOrder',
      payload,
      success: (result) => {
        // 存储手机号和用户名
        Taro.setStorageSync(STORAGE.ORDER_USER_NAME, name)
        Taro.setStorageSync(STORAGE.ORDER_USER_MOBILE, phone)

        Taro.setStorageSync(STORAGE.SOURCE_SHOP_ID, 0)
        Taro.setStorageSync(STORAGE.SOURCE_DRIVER_ID, 0)
        if (scene === 'JINGDIAN_PRIVATE' || scene === 'MEISHI_PRIVATE') {
          this.props.dispatch({
            type: 'order/confirmUserOrder',
            payload: {
              id: result.id,
            },
            success: () => {
              this.props.dispatch({
                type: 'order/setUserOrder',
                payload: {
                  // 付款成功修改订单状态
                  order: { ...result, order_status: 'WAIT_ACCEPT' },
                  chexing,
                  zuowei,
                  consume,
                  private_consume,
                },
                success: () => {
                  Taro.navigateTo({
                    url: '../orderStatus/index?goHome=true',
                  })
                },
                fail: () => {
                  this.props.dispatch({
                    type: 'order/setUserOrder',
                    payload: {
                      order: { ...result },
                      chexing,
                      zuowei,
                      consume,
                      private_consume,
                    },
                    success: () => {
                      Taro.navigateTo({
                        url: '../orderStatus/index?goHome=true',
                      })
                    },
                  })
                },
              })
            },
          })
        } else {
          // 拉起支付
          Taro.requestPayment({
            timeStamp: result.wechat_timestamp,
            nonceStr: result.wechat_nonce_str,
            package: 'prepay_id=' + result.wechat_order_id,
            signType: 'MD5',
            paySign: result.wechat_pay_sign,
            success: () => {
              this.props.dispatch({
                type: 'order/setUserOrder',
                payload: {
                  // 付款成功修改订单状态
                  order: {
                    ...result,
                    order_status: 'WAIT_ACCEPT',
                    has_pay: true,
                  },
                  chexing,
                  zuowei,
                  consume,
                  private_consume,
                },
                success: () => {
                  Taro.navigateTo({
                    url: '../orderStatus/index?goHome=true',
                  })
                },
              })
            },
            fail: () => {
              this.props.dispatch({
                type: 'order/setUserOrder',
                payload: {
                  order: { ...result },
                  chexing,
                  zuowei,
                  consume,
                  private_consume,
                },
                success: () => {
                  Taro.navigateTo({
                    url: '../orderStatus/index?goHome=true',
                  })
                },
              })
            },
          })
        }
      },
      fail: (message) => {
        if (message === 'no_pay') {
          this.setState({
            showTip: true,
          })
          return
        }
        Taro.showToast({
          title: message || '创建订单失败',
          icon: 'none',
        })
      },
    })
  }

  timeAction = (e) => {
    e.stopPropagation()
  }

  getPrice = (options) => {
    this.props.dispatch({
      type: 'order/getPrice',
      ...options,
    })
  }

  handleLocationChange = (location) => {
    this.setState({
      start_place: location,
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
                price_strategy_id,
              },
              success: (finalPrice) => {
                this.setState({
                  price: finalPrice,
                })
                this.props.dispatch({
                  type: 'coupon/getUsableCoupon',
                  payload: {
                    price: finalPrice || 0,
                    user_id: Taro.getStorageSync(STORAGE.USER_ID),
                  },
                })
              },
              fail: () => {
                Taro.showToast({
                  title: '无法获取订单价格',
                  icon: 'none',
                })
              },
            })
        },
      })
    }
  }

  changeName = (name) => {
    this.setState({
      name,
    })
  }

  changePhone = (phone) => {
    this.setState({
      phone,
    })
  }

  handleChangeTime = (value) => {
    this.setState({
      start_time: value,
    })
    const { order } = this.state
    const { price_strategy_id } = order
    if (this.kilo && this.time) {
      this.getPrice({
        payload: {
          start_time: value.valueOf(),
          kilo: this.kilo,
          time: this.time,
          price_strategy_id,
        },
        success: (finalPrice) => {
          this.setState({
            price: finalPrice,
          })
        },
        fail: () => {
          Taro.showToast({
            title: '无法获取订单价格',
            icon: 'none',
          })
        },
      })
    }
  }

  gotoSchedule = () => {
    this.handleClose()
    Taro.setStorageSync(STORAGE.SWITCH_INDEX, 3)
    Taro.switchTab({
      url: '../schedule/index',
    })
  }

  handleClose = () => {
    this.setState({
      showTip: false,
    })
  }

  render() {
    const {
      start_place = '厦门市思明区',
      name,
      phone,
      start_time,
      price,
      order,
      coupon,
      showTip,
    } = this.state
    const { private_consume = {} } = order
    const { usableList } = this.props
    const couponClassName =
      !!usableList && usableList.length
        ? 'coupon-right'
        : 'coupon-right coupon-right-gray'
    const scrollStyle = {
      height: `${window.$screenHeight - -window.$statusBarHeight - 274}rpx`,
    }
    let productImg
    try {
      productImg = private_consume.images
        ? private_consume.images.split(',')[0]
        : ''
    } catch (error) {}
    return (
      <View
        className='pay-product'
        style={{ top: 88 + window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='订单支付' />

        <ScrollView scrollY style={scrollStyle} scrollWithAnimation>
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
                externalClass={styles.detailContent}
                title={start_place.title}
                placeholder='请选择上车地点'
                onChange={this.handleLocationChange}
              />
              <View
                className='location-icon'
                onClick={debounce(this.onLocate, 100)}
              ></View>
            </View>
            <View className='detail-split' />
            <View className='detail-item'>
              <View className='detail-label'>乘车人姓名</View>
              <AtInput
                className='detail-input'
                name='detail-input-name'
                value={name}
                placeholder='请输入姓名'
                onChange={this.changeName}
              />
            </View>
            <View className='detail-split' />
            <View className='detail-item'>
              <View className='detail-label'>乘车人手机号</View>
              <AtInput
                type='phone'
                className='detail-input'
                name='detail-input-phone'
                value={phone}
                placeholder='请输入手机号'
                onChange={this.changePhone}
              />
            </View>
            <View className='detail-split' />
            <View className='detail-item' onClick={this.timeAction}>
              <View className='detail-label'>用车时间</View>
              <DateTimePicker
                wrapClass={styles.detailContent}
                onOk={this.handleChangeTime}
                hidePassed
                initValue={start_time}
                placeholder='请选择日期'
              />
              <View className='time-icon'></View>
            </View>
          </View>
          <View className='coupon-container'>
            <View className='title-label'>优惠券</View>
            {/* <View className='subtitle-label'>增值税发票不享受优惠</View> */}
            <View
              className={couponClassName}
              onClick={debounce(this.goToCoupon, 100)}
            >
              {!!coupon
                ? `-${coupon.price}￥`
                : usableList && usableList.length
                ? `${usableList.length}张优惠券`
                : '无可用优惠券'}
            </View>
          </View>
        </ScrollView>
        <View className='pay-gift-footer'>
          <Label className='pay-it' onClick={debounce(this.handlePay, 200)}>
            立即预约
          </Label>
          <Label className='total-footer'>{`￥${returnFloat(
            price - (coupon ? coupon.price : 0)
          )}`}</Label>
          <Label className='sum-text'>合计：</Label>
        </View>
        <AtModal
          isOpened={showTip}
          title='下单失败'
          cancelText='取消'
          confirmText='去支付'
          onClose={this.handleClose}
          onCancel={this.handleClose}
          onConfirm={this.gotoSchedule}
          content='您还有未支付的订单，请支付完成后重试。去支付？'
        />
      </View>
    )
  }
}

export default PayProduct
