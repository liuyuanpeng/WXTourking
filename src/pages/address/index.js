import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, Label, ScrollView, SwiperItem } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from 'react-redux'
import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import { debounce } from 'debounce'

@connect(({ address }) => ({
  data: address.list,
  defaultAddress: address.defaultAddress
}))
class Address extends Component {
  config = {
  }

  state = {}

  componentWillMount() {
    if (Taro.getCurrentInstance().router.params.mode === 'select') {
      this.selectMode = true
    }
    this.getData()
  }

  getData() {
    const {dispatch} = this.props
    dispatch({
      type: 'address/getUserAddress'
    })
  }

  onSelect = (data, e) => {
    e.stopPropagation()
    if (this.selectMode) {
      const pages = Taro.getCurrentPages()
      const prePage = pages[pages.length - 2]
      prePage.setData({
        address: data
      })
      Taro.navigateBack()
    }
  }

  handleEdit = (item, e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../saveAddress/index',
      success: res=>{
        res.eventChannel.emit('addressData', {
          ...item
        })
      }
    })
  }

  handleNew = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../saveAddress/index'
    })
  }

  render() {
    const {data} = this.props
    return (
      <View className='address-page' style={{top: 88 + window.$statusBarHeight + 'rpx'}}>
        <SysNavBar title='我的地址' />
        {data.map((item, index) => (
          <View className='address-item' key={`address-item-${index}`} onClick={this.onSelect.bind(this, item)}>
            <View className='address-left'>
              <Label className='address-name'>{item.name}</Label>
              <Label className='address-phone'>{item.mobile}</Label>
              <View className='address-address'>{item.address}</View>
            </View>
            <View
              className='address-right'
              onClick={this.handleEdit.bind(this, item)}
            >
              编辑
            </View>
          </View>
        ))}
        <View className='address-new' onClick={debounce(this.handleNew, 100)}>新增地址</View>
      </View>
    )
  }
}

export default Address
