import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, ScrollView } from '@tarojs/components'

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


class MyBalance extends Component {
  config = {
    navigationBarTitleText: '我的余额'
  }

  state = {}

  

  componentDidMount() {}

  onCashOut = e => {
    e.stopPropagation()
  }

  render() {
    

    return (
      <View className='my-balance-page' style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}>
        <SysNavBar title='我的余额' />
        <View className='my-balance-icon' />
        <View className='my-balance-label'>我的余额</View>
        <View className='my-balance-value'>
          <View className='my-balance-sign'>￥</View>
          <View className='my-balance-number'>183</View>
        </View>
        <View className='my-balance-tip'>金额满100即可提现</View>
        <View className='my-balance-button' onClick={this.onCashOut}>
          提现到微信
        </View>
      </View>
    )
  }
}

export default MyBalance
