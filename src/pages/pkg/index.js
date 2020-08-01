import Taro, { Component } from '@tarojs/taro'
import { View, Text, Label, Swiper, ScrollView } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
// import '../../asset/common/index.scss'
import './index.scss'

import daySchedulePng from '@images/day_schedule.png'
import {
  AtCheckbox,
  AtNavBar,
  AtInputNumber,
  AtTabs,
  AtTabsPane
} from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import BillItem from '@components/BillItem'
import CheckBox from '@components/CheckBox'

@connect(({ city }) => ({
  currentCity: city.current
}))
class Pkg extends Component {
  config = {
    navigationBarTitleText: '选择里程套餐'
  }

  state = {
    current: 0,
    charterData: {}
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
  }

  componentWillMount() {}

  componentDidMount() {
    const current = this.$router.params.index || 0
    this.setState({
      current: parseInt(current)
    })

    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('acceptCharterData', data => {
      this.setState({
        charterData: data || {}
      })
    })
  }

  handleOK = e => {
    e.stopPropagation()
    const { dispatch, currentCity } = this.props
    const { charterData, current } = this.state
    const { start_place, target_place, start_time, days } = charterData
    dispatch({
      type: 'consume/getConsumeList',
      payload: {
        params: {
          scene: 'DAY_PRIVATE',
          city_id: currentCity.id,
          taocan: current ? 'meal_2' : 'meal_1'
        }
      },
      success: () => {
        Taro.navigateTo({
          url: '../carType/index',
          success: res => {
            res.eventChannel.emit('acceptData', {
              start_place,
              target_place,
              start_time,
              scene: 'DAY_PRIVATE',
              days
            })
          }
        })
      },
      fail: () => {
        Taro.showToast({
          title: '获取用车服务失败',
          icon: 'none'
        })
      }
    })
  }

  render() {
    const { current, charterData = {} } = this.state
    const tabList = [{ title: '8小时100公里' }, { title: '8小时200公里' }]
    const { start_place, target_place, start_time, days } = charterData
    if (!start_place) return null
    const headers = [
      {
        label: '上车',
        title: start_place.title
      },
      {
        label: '发车时间',
        title: start_time.format('YYYY-MM-DD HH:mm')
      },
      {
        label: '下车',
        title: target_place.title
      },
      {
        label: '包车时间',
        title: `${days}天`
      }
    ]

    const detail = {
      title: tabList[current].title,
      price: current === 0 ? 699 : 1299,
      details: [
        {
          title: '套餐说明',
          subtitle: `用车当日可使用8小时，包含${
            current === 0 ? 1 : 2
          }00公里（多日包车中当日未用完的部分不可累计）`
        },
        {
          title: '套餐包含',
          subtitle: '套餐包含车辆使用费、燃油费、司机服务费，伙食费'
        },
        {
          title: '套餐不含',
          subtitle:
            '套餐中，不包含以下内容产生的费用：\r\n\
          1、超时长费：超出套餐时长产生的费用（收费标准详见订单填写页）\r\n\
          2、超公里费：超出套餐公里数产生的费用（收费标准详见订单填写页）\r\n\
          3、空驶费：实际下车地点与下单时填写的不一致导致的司机车辆空驶费用。（收费标准详见订单填写页）\r\n\
          4、第三方费用：实际行驶中产生的停车费、过路过桥费、高速费\r\n\
          5、个人费用：如您的景点门票，游玩项目等\r\n'
        }
      ]
    }

    return (
      <View
        className='pkg-page'
        style={{
          top: 88 + Taro.$statusBarHeight + 'rpx',
          minHeight: Taro.$windowHeight - 88 - Taro.$statusBarHeight + 'rpx'
        }}
      >
        <SysNavBar title='选择里程套餐' />
        <View className='pkg-header'>
          <View className='pkg-header-split-line' />
          {headers.map((item, index) => (
            <View className='pkg-header-item' key={`pkg-header-item-${index}`}>
              <Label className='pkg-header-item-label'>{item.label}</Label>
              <Label className='pkg-header-item-title'>{item.title}</Label>
            </View>
          ))}
        </View>
        <View className='pkg-tabs'>
          {tabList.map((item, index) => (
            <View
              className={`pkg-tabs-item${
                current === index ? ' pkg-tabs-item-active' : ''
              }`}
              key={`pkg-tabs-item-${index}`}
              onClick={this.handleClick.bind(this, index)}
            >
              {item.title}
            </View>
          ))}
        </View>
        <View className='pkg-content'>
          <View className='pkg-content-title'>{detail.title}</View>
          <View className='pkg-content-price'>
            {`￥${detail.price}`}
            <Label className='pkg-content-price-unit'>起/车</Label>
          </View>
          <View className='pkg-content-unit-tip'>1天总价</View>
          {detail.details.map((item, index) => (
            <View
              className='pkg-content-item'
              key={`pkg-content-item-${index}`}
            >
              <View className='pkg-content-item-title'>{item.title}</View>
              <Text className='pkg-content-item-subtitle'>{item.subtitle}</Text>
            </View>
          ))}
        </View>
        <View className='pkg-footer'>
          <View className='pkg-ok-btn' onClick={this.handleOK}>
            选车型
          </View>
        </View>
      </View>
    )
  }
}

export default Pkg
