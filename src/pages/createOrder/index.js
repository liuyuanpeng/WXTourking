import Taro, { Component } from '@tarojs/taro'
import { View, Label, Text, ScrollView, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import '../../common/index.scss'
import './index.scss'

import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import BillItem from '@components/BillItem'
import CheckBox from '@components/CheckBox'
import PopView from '@components/PopView'
import dayjs from 'dayjs'
import { AtInput } from 'taro-ui'
import STORAGE from '@constants/storage'
import LocationInput from '@components/LocationInput'
import DateTimePicker from '@components/DateTimePicker'

@connect(({ city, coupon }) => ({
  currentCity: city.current,
  usableList: coupon.usableList
}))
class CarType extends Component {
  config = {
    navigationBarTitleText: '填写订单'
  }

  state = {
    visible: false,
    detailVisible: false,
    name: '',
    phoneNum: '',
    phoneNumBackup: '',
    order: {},
    startPlace: { title: '' },
    startTime: dayjs().add(1, 'day'),
    coupon: ''
  }

  componentDidMount() {
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('orderData', data => {
      this.setState({
        order: data
      })

      const {price} = data
      if (price) {
        // 获取可用优惠券
        this.props.dispatch({
          type: 'coupon/getUsableCoupon',
          payload: {
            price,
            user_id: Taro.getStorageSync(STORAGE.USER_ID)
          }
        })
      }
    })

    const name = Taro.getStorageSync(STORAGE.ORDER_USER_NAME) || ''
    const phoneNum = Taro.getStorageSync(STORAGE.ORDER_USER_MOBILE) || ''
    const phoneNumBackup =
      Taro.getStorageSync(STORAGE.ORDER_USER_MOBILE_BACKUP) || ''
    this.setState({
      name,
      phoneNum,
      phoneNumBackup
    })
  }

  handleOK = e => {
    e.stopPropagation()
  }

  showScheduleDetail = (visible = true) => {
    this.setState({
      visible
    })
  }

  onChangeName = name => {
    this.setState({
      name
    })
  }

  onChangePhone = phone => {
    this.setState({
      phoneNum: phone
    })
  }

  onChangePhoneBackup = phone => {
    this.setState({
      phoneNumBackup: phone
    })
  }

  goToCoupon = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../coupon/index?canEdit=true&price='+this.state.order.price,
      events: {
        acceptCoupon: coupon => {
          this.setState({
            coupon
          })
        }
      }
    })
  }

  handleChat = e => {
    e.stopPropagation()
  }

  handlePhone = e => {
    e.stopPropagation()
    Taro.makePhoneCall({
      phoneNumber: '0592-5550907'
    })
  }

  showDetail = (detailVisible = true) => {
    this.setState({
      detailVisible
    })
  }

  handlePay = e => {
    e.stopPropagation()
    const {
      name,
      phoneNum,
      phoneNumBackup,
      order,
      startPlace,
      startTime,
      coupon
    } = this.state

    const {currentCity} = this.props

    const {
      scene,
      city_id = currentCity.id,
      air_no = '',
      kilo = 0,
      time = 0,
      start_place = {},
      target_place = {},
      start_time,
      chexing = {},
      zuowei = {},
      consume = {},
      price,
      days = 1,
      private_consume = {}
    } = order
    let msg = ''
    const regex = /^(13|14|15|16|17|18|19)\d{9}$/
    if (!name) {
      msg = '请输入您的姓名'
    } else if (!phoneNum || !regex.test(phoneNum)) {
      msg = '请输入正确的手机号'
    } else if (scene === 'ROAD_PRIVATE') {
      if (
        !startPlace ||
        !startPlace.title ||
        !startPlace.latitude ||
        !startPlace.longitude
      ) {
        msg = '请选择上车地点'
      } else if (startTime.isBefore(dayjs())) {
        msg = '上车时间已过期'
      }
    }
    if (msg) {
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }

    // 创建订单
    const payload = {
      user_id: Taro.getStorageSync(STORAGE.USER_ID),
      user_mobile: Taro.getStorageSync(STORAGE.USER_PHONE),
      open_id: Taro.getStorageSync(STORAGE.OPEN_ID),
      scene,
      common_scene: 'ORDER',
      city_id,
      chexing_id: chexing.id || '',
      zuowei_id: zuowei.id || '',
      price,
      total_price: price,
      start_time: start_time ? start_time.valueOf() : '',
      kilo,
      time,
      air_no,
      days,
      start_place: start_place.title || '',
      start_latitude: start_place.latitude || '',
      start_longitude: start_place.longitude || '',
      target_place: target_place.title || '',
      target_latitude: target_place.latitude || '',
      target_longitude: target_place.longitude || '',
      contact_mobile: phoneNumBackup || '',
      mobile: phoneNum || '',
      order_source: 'USER',
      consume_id: consume.id || '',
      username: name || '',
      private_consume_id: private_consume.id || ''
    }
    if (scene === 'ROAD_PRIVATE') {
      payload.start_time = startTime.valueOf()
      payload.start_place = startPlace.title
      payload.start_latitude = startPlace.latitude
      payload.start_longitude = startPlace.longitude
    }

    // 使用优惠券信息
    if (coupon && coupon.id) {
      payload.coupon_id = coupon.id
      payload.coupon_price = coupon.price
    }

    this.props.dispatch({
      type: 'order/createOrder',
      payload,
      success: result => {
        // 存储手机号和用户名
        Taro.setStorageSync(STORAGE.ORDER_USER_NAME, name)
        Taro.setStorageSync(STORAGE.ORDER_USER_MOBILE, phoneNum)
        Taro.setStorageSync(STORAGE.ORDER_USER_MOBILE_BACKUP, phoneNumBackup)
        // 拉起支付

        this.props.dispatch({
          type: 'order/setUserOrder',
          payload: {
            order: { ...result },
            chexing,
            zuowei,
            consume,
            private_consume
          },
          success: () => {
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

  handleLocationChange = location => {
    this.setState({
      startPlace: location
    })
  }

  handleChangeTime = value => {
    this.setState({
      startTime: value
    })
  }

  getRouteDetail(routeDetail) {
    return (
      <View>
        {routeDetail.map((item, index) => (
          <View
            className='route-detail-item'
            key={`route-detail-item-${index}`}
          >
            <Text className='route-detail-item-title'>{item.title}</Text>
            {item.subtitle && (
              <View className='route-detail-item-subtitle'>
                {item.subtitle}
              </View>
            )}
            {item.subtitles &&
              item.subtitles.map((subtitle, INDEX) => (
                <View
                  className='route-detail-item-subtitles'
                  key={`route-detail-item-subtitles-${INDEX}`}
                >
                  <View>
                    <Label className='route-detail-item-subtitles-title'>
                      {subtitle.title}
                    </Label>
                    {subtitle.tip && (
                      <Label className='route-detail-item-subtitles-tip'>
                        {subtitle.tip}
                      </Label>
                    )}
                  </View>
                  <Text className='route-detail-item-subtitles-subtitle'>
                    {subtitle.subtitle}
                  </Text>
                </View>
              ))}
          </View>
        ))}
      </View>
    )
  }

  render() {
    const {
      detailVisible,
      visible,
      name,
      phoneNum,
      phoneNumBackup,
      order,
      startPlace,
      startTime,
      coupon
    } = this.state

    const {
      start_time = dayjs(),
      days = 1,
      chexing = {},
      zuowei = {},
      price = 0,
      private_consume = {},
      scene
    } = order

    let productImg
    try {
      productImg = private_consume.images
        ? private_consume.images.split(',')[0]
        : ''
    } catch (error) {
      return <View></View>
    }
    const { currentCity, usableList } = this.props

    const assurance = ['专车司机', '行前联系', '免费等待30分钟']

    const platformAssurance = [
      {
        title: '平台保障',
        subtitle:
          '您在旅行过程中遇到任何问题都可以联系客服进行解决，旅王平台会全程监控车导师傅的服务情况，为您完成服务后才会将订单款项支付给车导师傅。旅王出行希望能给您带来最纯粹的当地体验和最安全的出行服务。'
      },
      {
        title: '费用说明',
        subtitle: '包含车费、高速费、车导工资，不包含门票费用、早午餐自理'
      },
      {
        title: '取消规则',
        subtitle:
          '订单支付后到出行前24小时取消免费。如因不可抗力原因（包括自然灾害、社会时间、航班取消等非人为因素）造成订单取消或者旅王出行车导师傅不能服务时，取消免费。订单支付后到出行前12小时取消 收取违约金30%，订单支付后到出行前6小时取消 收取违约金50%，出行前6小时取消收取违约金100%'
      },
      {
        title: '更改规则',
        subtitle:
          '订单支付后，只可修改联系人姓名和联系方式。如果需要更改服务时间、人数、车型、包车方式等信息，您需要取消原订单后重新下单支付，重新下单价格可能会出现浮动（价格受节假日和急单预定时间等因素影响）。'
      },
      {
        title: '电子发票',
        subtitle: '订单完成后，可联系客服申请电子发票，每个订单仅可开一次发票。'
      }
    ]

    const routeDetail = [
      {
        title: '费用说明',
        subtitles: [
          {
            title: '包车须知',
            subtitle: '当日限10小时300公里'
          }
        ]
      },
      {
        title: '费用包含',
        subtitles: [
          {
            title: '· 用车基础服务费',
            subtitle:
              '当地人服务费、车辆服务费、小费、油费、过路费、高速费、停车费、进城费、空驶费、接送机夜间费、包车餐补、跨天包车住宿补贴'
          }
        ]
      },
      {
        title: '费用不含',
        subtitles: [
          {
            title: '· 包车时长费 ',
            subtitle: '超时等待费按照30分钟为一档收取(不满30分钟按30分钟计算)',
            tip: '￥150/30分钟'
          },
          {
            title: '· 包车公里费 ',
            subtitle:
              '当日服务小时与里程仅当天有效，不累计到第二天，当地人可按照标准收取超时费和超公里费。(一 天内超时费和超公里费同时生效时，费用不累加，只按照费用高的一项收取)',
            tip: '￥2/公里'
          },
          {
            title: '· 包车夜间服务费 ',
            subtitle:
              '常规服务时间段为当地时间08:00- 22:00， 如需在常规服务时间段外服务，用户需按照标准向当地人支付夜间服务费',
            tip: '￥200/天'
          }
        ]
      }
    ]

    const priceDetail = {
      detailList: [
        {
          name: '用车费用',
          value: '￥' + price
        },
        {
          name: '用车保险',
          value: '免费'
        },
        {
          name: '合计',
          value: '￥' + price,
          total: true
        }
      ],
      intro: routeDetail
    }

    const scrollStyle = {
      height: `${Taro.$windowHeight - 424 - 194}rpx`
    }

    const scrollStylePop = {
      height: `${Taro.$windowHeight - 400}rpx`
    }

    return (
      <View className='car-page'>
        <SysNavBar transparent title='填写订单' />
        <View className='car-page-bkg' />
        {scene === 'ROAD_PRIVATE' ? (
          <View className='car-header'>
            <Image
              mode='aspectFill'
              className='car-header-image'
              src={productImg}
            />
            <View className='car-header-right'>
              <View className='car-header-right-title'>
                {private_consume.name}
              </View>
              <View className='car-header-right-subtitle'>
                {private_consume.tag}
              </View>
              <View className='car-header-right-subtitle'>
                ￥{returnFloat(private_consume.price)}
              </View>
            </View>
          </View>
        ) : (
          <View className='car-header'>
            <View>
              {scene === 'DAY_PRIVATE' && <Label className='car-header-title'>包车{days}天</Label>}
              <Label className='car-header-start'>{currentCity.name}出发</Label>
            </View>
            <View className='car-header-time'>
              {start_time
                ? start_time.format('当地时间MM月DD日 HH:mm用车')
                : ''}
            </View>
            <View className='car-header-car-type'>
              {`${chexing.name + zuowei.name} | ${chexing.passengers} | ${
                chexing.baggages
              }`}
            </View>
            <View
              className='car-header-detail'
              onClick={this.showScheduleDetail.bind(this, true)}
            >
              行程详情
            </View>
            <View className='car-header-assurance'>
              {assurance.map((item, index) => (
                <View
                  className='car-header-assurance-item'
                  key={`car-header-assurance-item-${index}`}
                >
                  {item}
                </View>
              ))}
            </View>
          </View>
        )}
        <ScrollView className='content-scroll' scrollY style={scrollStyle}>
          <View className='phones'>
            <View className='phones-header'>
              <View className='phones-header-title'>如何联系您</View>
              <Text className='phones-header-subtitle'>
                请留下您的电话号码，车导师傅会通过电话、短信联系您
              </Text>
            </View>
            <View className='phones-item'>
              <View className='phones-item-label'>姓名</View>
              <AtInput
                className='phones-item-input'
                placeholder='请输入您的姓名'
                value={name}
                onChange={this.onChangeName}
              />
            </View>
            {scene === 'ROAD_PRIVATE' && (
              <View>
                <View className='phones-split-line' />
                <View className='phones-item'>
                  <View className='phones-item-label'>选择上车地点</View>
                  <LocationInput
                    wrap-class='phones-item-input'
                    title={startPlace.title}
                    placeholder='请选择上车地点'
                    onChange={this.handleLocationChange}
                  />
                </View>
                <View className='phones-split-line' />
                <View className='phones-item'>
                  <View className='phones-item-label'>用车时间</View>
                  <DateTimePicker
                    wrap-class='phones-item-input'
                    onOk={this.handleChangeTime}
                    hidePassed
                    initValue={startTime}
                    placeholder='请选择日期'
                  />
                </View>
              </View>
            )}
            <View className='phones-split-line' />
            <View className='phones-item'>
              <View className='phones-item-label'>手机号</View>
              <AtInput
                type='phone'
                className='phones-item-input'
                placeholder='请输入您的手机号'
                value={phoneNum}
                onChange={this.onChangePhone}
              />
            </View>
            {scene !== 'ROAD_PRIVATE' && (
              <View>
                <View className='phones-split-line' />
                <View className='phones-item'>
                  <View className='phones-item-label'>备用手机号</View>
                  <AtInput
                    type='phone'
                    className='phones-item-input'
                    placeholder='您的同行人手机号'
                    value={phoneNumBackup}
                    onChange={this.onChangePhoneBackup}
                  />
                </View>
              </View>
            )}
          </View>
          <View className='coupon-container'>
            <View className='title-label'>优惠券</View>
            <View className='subtitle-label'>增值税发票不享受优惠</View>
            <View
              className={`coupon-right ${usableList && usableList.length ? '' : 'coupon-right-gray'}`}
              onClick={this.goToCoupon}
            >
              {coupon ? `-${coupon.price}￥` : (usableList && usableList.length ? `${usableList.length}张优惠券` : '无可用优惠券')}
            </View>
          </View>
          <View className='contact'>
            <View className='contact-title'>旅王出行</View>
            <View className='contact-subtitle'>官方客服</View>
            <View className='contact-right'>
              <Button className='contact-right-chat' open-type='contact' />
              <View
                className='contact-right-phone'
                onClick={this.handlePhone}
              />
            </View>
          </View>
          <View className='platform-assurance'>
            {platformAssurance.map((item, index) => (
              <View
                className='platform-assurance-item'
                key={`platform-assurance-item-${index}`}
              >
                <View className='platform-assurance-item-title'>
                  {item.title}
                </View>
                <Text className='platform-assurance-item-subtitle'>
                  {item.subtitle}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <View className='pay-tip'>
          {`现在支付，北京时间${start_time.format(
            'MM月DD日HH时mm分'
          )}前可免费取消`}
        </View>
        <View className='footer'>
          <View className='price'>￥{coupon ? price-coupon.price : price}</View>
          <View className='detail' onClick={this.showDetail}>
            明细
          </View>
          <View className='pay-button' onClick={this.handlePay}>
            立即支付
          </View>
        </View>

        <PopView
          title='行程详情'
          visible={visible}
          onClose={this.showScheduleDetail.bind(this, false)}
        >
          <View className='pop-container'>
            {this.getRouteDetail(routeDetail)}
          </View>
        </PopView>
        <PopView
          title='价格明细'
          visible={detailVisible}
          onClose={this.showDetail.bind(this, false)}
        >
          <ScrollView scrollWithAnimation scrollY style={scrollStylePop}>
            <View className='pop-container'>
              {priceDetail.detailList.map((item, index) => (
                <View
                  className='price-detail-item'
                  key={`price-detail-item-${index}`}
                >
                  <View
                    className={`price-detail-item-name${
                      item.total ? '-total' : ''
                    }`}
                  >
                    {item.name}
                  </View>
                  <View
                    className={`price-detail-item-value${
                      item.total ? '-total:' : ''
                    }`}
                  >
                    {item.value}
                  </View>
                </View>
              ))}
              {this.getRouteDetail(priceDetail.intro)}
            </View>
          </ScrollView>
        </PopView>
      </View>
    )
  }
}

export default CarType
