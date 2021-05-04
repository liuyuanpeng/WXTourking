import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, Label, Swiper, ScrollView, Button } from '@tarojs/components'

import { connect } from 'react-redux'
// import '../../common/index.scss'
import './index.scss'

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
    navigationBarTitleText: '我的客服'
  }

  state = {}

  componentDidMount() {}

  onPhone = e => {
    e.stopPropagation()
    Taro.makePhoneCall({
      phoneNumber: '0592-5550907'
    })
  }

  render() {
    return (
      <View
        className='my-balance-page'
        style={{ top: 88 + window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='我的客服' />

        <View className='my-balance-button' onClick={this.onPhone}>
          0592-5550907
        </View>

        <Button
          className='my-balance-button'
          open-type='contact'
        >
          在线客服
        </Button>
      </View>
    )
  }
}

export default MyBalance
