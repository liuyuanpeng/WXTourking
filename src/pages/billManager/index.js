import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, Label, Swiper, ScrollView } from '@tarojs/components'
import NavBar from '@components/NavBar'
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
import STORAGE from '@constants/storage'
import dayjs from 'dayjs'
import { debounce } from 'debounce'

@connect(({ bill }) => ({
  total_price: bill.price,
  data: bill.list
}))
class BillManager extends Component {
  config = {
    navigationBarTitleText: '发票管理'
  }

  componentDidShow() {
    const {dispatch} = this.props
    dispatch({
      type: 'bill/getBillPrice'
    })
    dispatch({
      type: 'bill/getBillPage',
      payload: {
        page: 0,
        size: 10,
        user_id: Taro.getStorageSync(STORAGE.USER_ID)
      }
    })
  }

  handleAllBill = e => {
    e.stopPropagation()
    // 查看所有开票...
    Taro.navigateTo({
      url: '../allBill/index'
    })
  }

  handleBill = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../myBill/index'
    })
  }

  handleBillHeader = e => {
    e.stopPropagation()
    // 发票抬头管理...
    Taro.navigateTo({
      url: '../headers/index'
    })

  }

  handleBillAddress = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../address/index'
    })
  }

  render() {
    const {total_price, data} = this.props
    const contentStyle = {height: `${window.$screenHeight - 348}rpx`}
    const scrollStyle = {height: `${window.$screenHeight - 712}rpx`}

    return (
      <View
        className='bill-manager'
        // style={{ top: window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='发票管理' transparent />
        <View className='bill-manager-header'>
          <View className='bill-manager-header-title'>可开发票总金额</View>
          <View className='bill-manager-header-content'>
            <View className='bill-manager-header-content-icon'>￥</View>
            <View className='bill-manager-header-content-number'>
              {returnFloat(total_price || 0)}
            </View>
          </View>
        </View>
        <View className='bill-manager-content' style={contentStyle}>
          <View className='bill-manager-content-menu'>
            <View
              className='bill-manager-content-menu-item'
              onClick={debounce(this.handleBill, 100)}
            >
              <View className='bill-manager-content-menu-item-icon-1' />
              <View className='bill-manager-content-menu-item-name'>
                申请开票
              </View>
            </View>
            <View
              className='bill-manager-content-menu-item'
              onClick={debounce(this.handleBillHeader, 100)}
            >
              <View className='bill-manager-content-menu-item-icon-2' />
              <View className='bill-manager-content-menu-item-name'>
                发票抬头
              </View>
            </View>
            <View
              className='bill-manager-content-menu-item'
              onClick={debounce(this.handleBillAddress, 100)}
            >
              <View className='bill-manager-content-menu-item-icon-3' />
              <View className='bill-manager-content-menu-item-name'>
                邮寄地址
              </View>
            </View> </View>

            <View className='bill-manager-content-split' />
            <View className='bill-manager-content-list'>
              <View className='bill-manager-content-list-header'>
                <View className='bill-manager-content-list-header-title'>
                  近期开票
                </View>
                <View className='bill-manager-content-list-header-right' onClick={debounce(this.handleAllBill, 100)}>
                  查看全部
                  <View className='bill-manager-content-list-header-right-icon' />
                </View>
              </View>
              <View className='bill-manager-content-list-content' style={scrollStyle}>
                {
                  data && data.map(item=>(
                    <View key={item.id} className='bill-manager-content-list-content-item'>
                      <View className='bill-manager-content-list-content-item-title'>
                        {item.fapiao_name}
                      </View>
                      <View className='bill-manager-content-list-content-item-status'>{item.express_number?'已邮寄':'开票中'}</View>
                      <View className='bill-manager-content-list-content-item-price'>￥{item.price}</View>
                      <View className='bill-manager-content-list-content-item-time'>{dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}</View>
                      <View className='bill-manager-content-list-content-item-split' />
                    </View>
                  ))
                }
              </View>
            </View>
         
        </View>
      </View>
    )
  }
}

export default BillManager
