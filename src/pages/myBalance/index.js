import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, ScrollView } from '@tarojs/components'

import { connect } from '@tarojs/redux'
// import '../common/index.less'
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

@connect(({ system }) => ({
  info: system.info
}))
class MyBalance extends Component {
  config = {
    navigationBarTitleText: '我的余额'
  }

  state = {}

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

  onCashOut = e => {
    e.stopPropagation()
  }

  render() {
    const { windowHeight = 0 } = this.props.info
    if (!windowHeight) return <View></View>

    return (
      <View className='my-balance-page'>
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
