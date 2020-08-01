import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, ScrollView } from '@tarojs/components'
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
import CouponItem from '@components/CouponItem'
import dayjs from 'dayjs'


class Coupon extends Component {
  config = {
    navigationBarTitleText: '我的优惠券'
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

  

  componentDidMount() {
  }

  coupons = [
    {
      id: '1',
      value: 15,
      overflow: 50,
      start_time: dayjs('2020-04-10').valueOf(),
      end_time: dayjs('2020-04-17').valueOf() - 1,
      title: '旅王出行优惠券'
    },
    {
      id: '2',
      value: 15,
      overflow: 50,
      start_time: dayjs('2020-04-10').valueOf(),
      end_time: dayjs('2020-04-17').valueOf() - 1,
      title: '旅王出行优惠券'
    },
    {
      id: '3',
      value: 15,
      overflow: 50,
      start_time: dayjs('2020-04-10').valueOf(),
      end_time: dayjs('2020-04-17').valueOf() - 1,
      title: '旅王出行优惠券'
    },
    {
      id: '4',
      value: 15,
      overflow: 50,
      start_time: dayjs('2020-04-10').valueOf(),
      end_time: dayjs('2020-04-17').valueOf() - 1,
      title: '旅王出行优惠券'
    },
    {
      id: '5',
      value: 15,
      overflow: 50,
      start_time: dayjs('2020-04-10').valueOf(),
      end_time: dayjs('2020-04-17').valueOf() - 1,
      title: '旅王出行优惠券'
    }
  ]

  render() {
    const tabList = [
      { title: '未使用' },
      { title: '已使用' },
      { title: '已过期' }
    ]

    const scrollStyle = {
      height: `${Taro.$windowHeight - Taro.$statusBarHeight-276}rpx`
    }

    return (
      <View className='all-coupon-page' style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}>
        <SysNavBar title='我的优惠券' />
        <View className='all-coupon-tabs'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {this.coupons.map((item, index) => (
                  <CouponItem
                    type='effective'
                    key={`coupon-item-${index}`}
                    {...item}
                  />
                ))}
              </ScrollView>
</AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {this.coupons.map((item, index) => (
                  <CouponItem
                    type='used'
                    key={`coupon-item-${index}`}
                    {...item}
                  />
                ))}
              </ScrollView>
 </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {this.coupons.map((item, index) => (
                  <CouponItem
                    type='overdue'
                    key={`coupon-item-${index}`}
                    {...item}
                  />
                ))}
              </ScrollView>

           </AtTabsPane>
          </AtTabs>
        </View>
        <View className='coupon-bottom'>特别提示：每个用户1天最多使用2张优惠券</View>
            
      </View>
    )
  }
}

export default Coupon
