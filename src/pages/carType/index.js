import Taro, { Component } from '@tarojs/taro'
import { View, Label, Text, ScrollView, Image } from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
// import '../common/index.scss'
import './index.scss'

import CommentItem from '../../components/CommentItem'
import SysNavBar from '../../components/SysNavBar'
import { returnFloat } from '../../utils/tool'
import BillItem from '../../components/BillItem'
import CheckBox from '../../components/CheckBox'
import PopView from '../../components/PopView'
import dayjs from 'dayjs'

@connect(({ system }) => ({
  info: system.info
}))
class CarType extends Component {
  config = {
    navigationBarTitleText: '选择车型'
  }

  state = {
    current: 0,
    visible: false,
    scrollTop: 0
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

  componentWillMount() {
    if (this.props.info.windowHeight) return
    try {
      const res = Taro.getSystemInfoSync()
      const { dispatch } = this.props
      dispatch({
        type: 'system/updateSystemInfo',
        payload: res
      })
    } catch (e) {
      console.log('no system info')
    }
  }

  componentDidMount() {}

  handleOK = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../createOrder/index'
    })
  }

  showLuggageInfo = (visible = true) => {
    console.log('visible: ', visible)
    this.setState({
      visible
    })
  }
  render() {
    const { current, visible, scrollTop } = this.state
    const { days = 1, city = '厦门', start_time = dayjs() } = this.props

    const carTabs = [
      {
        sit: 5,
        price: 1299
      },
      {
        sit: 7,
        price: 1333
      },
      {
        sit: 10,
        price: 1892
      },
      {
        sit: 12,
        price: 2396
      },
      {
        sit: 5,
        price: 1299
      }
    ]

    const carList = [
      {
        title: '经济5座',
        detail: '日产尼桑/丰田Harrier',
        sit: 5,
        luggage: '24寸行李2件',
        price: 1790,
        image:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3376645129,1205322099&fm=26&gp=0.jpg'
      },
      {
        title: '舒适5座',
        detail: '日产尼桑/丰田Harrier',
        sit: 5,
        luggage: '24寸行李2件',
        price: 1928,
        image:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3376645129,1205322099&fm=26&gp=0.jpg'
      },
      {
        title: '豪华5座',
        detail: '日产尼桑/丰田Harrier',
        sit: 5,
        luggage: '24寸行李2件',
        price: 2066,
        image:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3376645129,1205322099&fm=26&gp=0.jpg'
      },
      {
        title: '经济7座',
        detail: '日产尼桑/丰田Harrier',
        sit: 7,
        luggage: '24寸行李2件',
        price: 1928,
        image:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3376645129,1205322099&fm=26&gp=0.jpg'
      },
      {
        title: '经济7座',
        detail: '日产尼桑/丰田Harrier',
        sit: 7,
        luggage: '24寸行李2件',
        price: 2066,
        image:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3376645129,1205322099&fm=26&gp=0.jpg'
      },
      {
        title: '豪华7座',
        detail: '日产尼桑/丰田Harrier',
        sit: 7,
        luggage: '24寸行李2件',
        price: 2888,
        image:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3376645129,1205322099&fm=26&gp=0.jpg'
      }
    ]

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

    const { windowHeight = 0, windowWidth } = this.props.info
    if (!windowHeight) return <View></View>
    const scrollStyle = {
      height: `${windowHeight * (750 / windowWidth) - 414}rpx`
    }

    return (
      <View className='car-page'>
        <SysNavBar transparent title='选择车型' />
        <View className='car-page-bkg' />
        <View className='car-header'>
          <View>
            <Label className='car-header-title'>包车{days}天</Label>
            <Label className='car-header-start'>{city}出发</Label>
          </View>
          <View className='car-header-time'>
            {start_time.format('当地时间MM月DD日 HH:mm用车')}
          </View>
          <View className='car-header-detail'>行程详情</View>
        </View>
        <View className='car-container'>
          <View className='car-tabs'>
            {carTabs.map((item, index) => (
              <View
                className={`car-tabs-item${
                  current === index ? ' car-tabs-item-active' : ''
                }`}
                key={`car-tabs-item-${index}`}
                onClick={this.handleClick.bind(this, index)}
              >
                <View className='car-tabs-item-sit'>{item.sit}座</View>
                <View className='car-tabs-item-price'>￥{item.price}起</View>
              </View>
            ))}
          </View>
          <View className='car-list'>
            <View className='car-list-header-view'>
              <View className='car-list-header'>
              <Label className='car-list-header-icon' />
              <Label className='car-list-header-split-line' />
              <Label className='car-list-header-sits'>
                {carTabs[current].sit}座
              </Label>
              </View>
            </View>
            <ScrollView scrollTop={scrollTop} scrollY style={scrollStyle} scrollWithAnimation>
              {carList.map((item, index) => (
                <View className='car-list-item' key={`car-list-item-${index}`}>
                  <View className='car-list-item-title'>{item.title}</View>
                  <Text className='car-list-item-detail'>{`${item.detail}\r\n或同级别车型`}</Text>
                  <View>
                    <Label className='car-list-item-passenger-icon' />
                    <Label className='car-list-item-passenger'>
                      乘客{item.sit - 1}人
                    </Label>
                    <Label className='car-list-item-luggage-icon' />
                    <Label className='car-list-item-luggage'>
                      {item.luggage}
                    </Label>
                    <Label
                      className='car-list-item-luggage-info'
                      onClick={this.showLuggageInfo.bind(this, true)}
                    />
                    <Image
                      className='car-list-item-image'
                      src={item.image}
                      mode='aspectFill'
                    />
                    <View className='car-list-item-split-line' />
                    <View className='car-list-item-price'>
                      <Label className='car-list-item-price-icon'>￥</Label>
                      {item.price}
                      <Label className='car-list-item-price-unit'>/起</Label>
                    </View>
                    <View className='car-list-item-btn' onClick={this.handleOK}>立即预约</View>
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
