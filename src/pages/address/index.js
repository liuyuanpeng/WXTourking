import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, ScrollView, SwiperItem } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'

@connect(({  }) => ({
}))
class Address extends Component {
  config = {}

  state = {}

  componentWillMount() {}

  handleEdit = (item, e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../saveAddress/index'
    })
  }

  handleNew = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../saveAddress/index'
    })
  }

  render() {
    const addresses = [
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号'
      },
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号'
      },
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号'
      },
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号'
      },
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号'
      },
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号'
      },
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号'
      },
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号'
      },
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号'
      },
      {
        name: '张三',
        phone: '15605085028',
        address: '福建省厦门市湖里区江头街道冠鸿花园312号福建省厦门市湖里区江头街道冠鸿花园312号福建省厦门市湖里区江头街道冠鸿花园312号福建省厦门市湖里区江头街道冠鸿花园312号'
      }
    ]
    return (
      <View className='address-page' style={{top: 88 + Taro.$statusBarHeight + 'rpx'}}>
        <SysNavBar title='我的地址' />
        {addresses.map((item, index) => (
          <View className='address-item' key={`address-item-${index}`}>
            <View className='address-left'>
              <Label className='address-name'>{item.name}</Label>
              <Label className='address-phone'>{item.phone}</Label>
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
        <View className='address-new' onClick={this.handleNew}>新增地址</View>
      </View>
    )
  }
}

export default Address
