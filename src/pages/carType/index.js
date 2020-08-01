import Taro, { Component } from '@tarojs/taro'
import { View, Label, Text, ScrollView, Image } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
// import '../../asset/common/index.scss'
import './index.scss'

import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import BillItem from '@components/BillItem'
import CheckBox from '@components/CheckBox'
import PopView from '@components/PopView'
import dayjs from 'dayjs'
import STORAGE from '@constants/storage'

@connect(({ consume, city }) => ({
  consume: consume.consume,
  consumes: consume.consumes,
  lowPrice: consume.lowPrice,
  currentCity: city.current
}))
class CarType extends Component {
  config = {
    navigationBarTitleText: '选择车型'
  }

  state = {
    current: 0,
    visible: false,
    scrollTop: 0,
    preData: {}
  }

  handleClick = (value, e) => {
    e.stopPropagation()

    if (this.state.current !== value) {
      this.setState({
        scrollTop: Math.random() //不能设置为0
      })
    }

    this.setState({
      current: value
    })
  }

  componentDidMount() {
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('acceptData', data => {
      this.setState({
        preData: data || {}
      })
    })
  }

  getPrice = (options) => {
    this.props.dispatch({
      type: 'order/getPrice',
      ...options
    })
  }

  handleOK = (carLevel, e) => {
    e.stopPropagation()
    const { consume } = this.props
    const {city_id} = consume
    const { price, price_strategy_id, chexing, zuowei } = carLevel
    const {
      start_place,
      target_place,
      start_time,
      fly,
      scene,
      kilo,
      time,
      days = 1
    } = this.state.preData
    console.log('price: ', price, 'days:', days)
    if (scene === 'JIEJI' || scene === 'SONGJI') {
      //接送机使用原有价格策略
      this.getPrice({
        payload: {
          start_time: start_time.valueOf(),
          kilo,
          time,
          price_strategy_id
        },
        success: finalPrice => {
          Taro.navigateTo({
            url: '../createOrder/index',
            success: res => {
              res.eventChannel.emit('orderData', {
                scene,
                city_id,
                air_no: fly || '',
                kilo,
                time,
                start_place,
                target_place,
                start_time,
                chexing,
                zuowei,
                consume,
                price: finalPrice
              })
            }
          })
        },
        fail: () => {
          Taro.showToast({
            title: '无法获取订单价格',
            icon: 'none'
          })
        }
      })
    } else {
      Taro.navigateTo({
        url: '../createOrder/index',
        success: res => {
          res.eventChannel.emit('orderData', {
            scene,
            city_id,
            start_place,
            target_place,
            start_time,
            chexing,
            zuowei,
            consume,
            price: price*days,
            days
          })
        }
      })
    }
    
  }

  showLuggageInfo = (visible = true) => {
    this.setState({
      visible
    })
  }
  render() {
    const { current, visible, scrollTop, preData={} } = this.state
    const { days = 1, start_time = dayjs(), scene={} } = preData
    const { lowPrice, consumes, currentCity } = this.props

    if (!Object.keys(lowPrice).length || !Object.keys(consumes).length) {
      return null
    }

    const luggageIntro = [
      {
        title: '行李计算',
        subtitle:
          '可载行李数均是以24寸行李为参考标准\r\n\
  超过24寸的大行李箱，计为2件\r\n\
  一个空座可增加1件24寸行李(豪华车型不适用)'
      },
      {
        title: '建议乘坐人数',
        subtitle:
          '· 5座车: 1-3人，2件行李\r\n\
          · 7座车: 4- -5人，3件行李\r\n\
          · 9座车: 6-7人，5件行李'
      }
    ]

    const scrollStyle = {
      height: `${Taro.$windowHeight - Taro.$statusBarHeight - 320}rpx`
    }

    return (
      <View className='car-page'>
        <SysNavBar transparent title='选择车型' />
        <View className='car-page-bkg' />
        <View className='car-header'>
          <View>
            <Label className='car-header-title'>
              {scene === 'JIEJI' || scene === 'SONGJI'
                ? '接送机/站'
                : `包车${days}天`}
            </Label>
            <Label className='car-header-start'>{currentCity.name}出发</Label>
          </View>
          <View className='car-header-time'>
            {start_time.format('当地时间MM月DD日 HH:mm用车')}
          </View>
          {/* <View className='car-header-detail'>行程详情</View> */}
        </View>
        <View className='car-container'>
          <View className='car-tabs'>
            {Object.keys(consumes).map((item, index) => (
              <View
                className={`car-tabs-item${
                  current === index ? ' car-tabs-item-active' : ''
                }`}
                key={`car-tabs-item-${index}`}
                onClick={this.handleClick.bind(this, index)}
              >
                <View className='car-tabs-item-sit'>{item}</View>
                <View className='car-tabs-item-price'>
                  ￥{lowPrice[item]}起
                </View>
              </View>
            ))}
          </View>
          <View className='car-list'>
            <View className='car-list-header-view'>
              <View className='car-list-header'>
                <Label className='car-list-header-icon' />
                <Label className='car-list-header-split-line' />
                <Label className='car-list-header-sits'>
                  {Object.keys(consumes)[current]}
                </Label>
              </View>
            </View>
            <ScrollView
              scrollTop={scrollTop}
              scrollY
              style={scrollStyle}
              scrollWithAnimation
            >
              {consumes[Object.keys(consumes)[current]].map((item, index) => (
                <View className='car-list-item' key={`car-list-item-${index}`}>
                  <View className='car-list-item-title'>
                    {item.chexing.name}
                    {item.zuowei.name}
                  </View>
                  <Text className='car-list-item-detail'>{`${item.chexing.description}`}</Text>
                  <View>
                    <Label className='car-list-item-passenger-icon' />
                    <Label className='car-list-item-passenger'>
                      {item.chexing.passengers}
                    </Label>
                    <Label className='car-list-item-luggage-icon' />
                    <Label className='car-list-item-luggage'>
                      {item.chexing.baggages}
                    </Label>
                    <Label
                      className='car-list-item-luggage-info'
                      onClick={this.showLuggageInfo.bind(this, true)}
                    />
                    <Image
                      className='car-list-item-image'
                      src={item.chexing.cover_image}
                      mode='aspectFill'
                    />
                    <View className='car-list-item-split-line' />
                    <View className='car-list-item-price'>
                      <Label className='car-list-item-price-icon'>￥</Label>
                      {item.price}
                      <Label className='car-list-item-price-unit'>/起</Label>
                    </View>
                    <View
                      className='car-list-item-btn'
                      onClick={this.handleOK.bind(this, item)}
                    >
                      立即预约
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <PopView
          title='行李说明'
          visible={visible}
          onClose={this.showLuggageInfo.bind(this, false)}
        >
          <View className='luggage-intro-image' />
          {luggageIntro.map((item, index) => (
            <View key={`luggage-intro-${index}`} className='luggage-intro'>
              <View className='luggage-intro-title'>{item.title}</View>
              <Text className='luggage-intro-subtitle'>{item.subtitle}</Text>
            </View>
          ))}
        </PopView>
      </View>
    )
  }
}

export default CarType
