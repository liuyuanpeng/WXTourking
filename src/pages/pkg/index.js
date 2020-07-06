import Taro, { Component } from '@tarojs/taro'
import { View, Text, Label, Swiper, ScrollView } from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
// import '../common/index.scss'
import './index.scss'

import daySchedulePng from '../../asset/images/day_schedule.png'
import {
  AtCheckbox,
  AtNavBar,
  AtInputNumber,
  AtTabs,
  AtTabsPane
} from 'taro-ui'
import CommentItem from '../../components/CommentItem'
import SysNavBar from '../../components/SysNavBar'
import { returnFloat } from '../../utils/tool'
import BillItem from '../../components/BillItem'
import CheckBox from '../../components/CheckBox'


class Pkg extends Component {
  config = {
    navigationBarTitleText: '选择里程套餐'
  }

  state = {
    current: 0
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    const current = this.$router.params.index || 0
    console.log(current, this.$router)
    this.setState({
      current: parseInt(current)
    })
  }

  handleOK = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../carType/index'
    })
  }

  render() {
    const { current } = this.state
    const tabList = [{ title: '8小时100公里' }, { title: '8小时200公里' }]

    const headers = [
      {
        label: '上车',
        title: '厦门-厦门高崎国际机场'
      },
      {
        label: '发车时间',
        title: '2020-04-02 15:30'
      },
      {
        label: '下车',
        title: '厦门-厦门高崎国际机场'
      },
      {
        label: '包车时间',
        title: '1天'
      }
    ]

    const detail = {
      title: tabList[current].title,
      price: current === 0 ? 699 : 1299,
      details: [
        {
          title: '套餐说明',
          subtitle: `用车当日可使用8小时，包含${current===0?1:2}00公里（多日包车中当日未用完的部分不可累计）`
        },
        {
          title: '套餐包含',
          subtitle: '套餐包含车辆使用费、燃油费、司机服务费，伙食费'
        },
        {
          title: '套餐不含',
          subtitle: '套餐中，不包含以下内容产生的费用：\r\n\
          1、超时长费：超出套餐时长产生的费用（收费标准详见订单填写页）\r\n\
          2、超公里费：超出套餐公里数产生的费用（收费标准详见订单填写页）\r\n\
          3、空驶费：实际下车地点与下单时填写的不一致导致的司机车辆空驶费用。（收费标准详见订单填写页）\r\n\
          4、第三方费用：实际行驶中产生的停车费、过路过桥费、高速费\r\n\
          5、个人费用：如您的景点门票，游玩项目等\r\n'
        }
      ]
    }

    return (
      <View className='pkg-page' style={{top: 88 + Taro.$statusBarHeight + 'rpx', minHeight: Taro.$windowHeight - 88 - Taro.$statusBarHeight + 'rpx'}}>
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
              className={`pkg-tabs-item${current === index ? ' pkg-tabs-item-active' : ''}`}
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
          {detail.details.map((item, index)=>(
            <View className='pkg-content-item' key={`pkg-content-item-${index}`}>
              <View className='pkg-content-item-title'>{item.title}</View>
              <Text className='pkg-content-item-subtitle'>{item.subtitle}</Text>
            </View>
          ))}
        </View>
        <View className='pkg-footer'>

        <View className='pkg-ok-btn' onClick={this.handleOK}>选车型</View>
        </View>
      </View>
    )
  }
}

export default Pkg
