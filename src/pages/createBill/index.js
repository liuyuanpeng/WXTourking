import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import {
  View,
  Image,
  Label,
  Swiper,
  ScrollView,
  Input
} from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from 'react-redux'
// import '../../common/index.scss'
import './index.scss'

import {
  AtCheckbox,
  AtNavBar,
  AtInputNumber,
  AtTabs,
  AtTabsPane,
  AtInput
} from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import BillItem from '@components/BillItem'
import CheckBox from '@components/CheckBox'
import { debounce } from 'debounce'

@connect(({ city, address, header }) => ({
  currentCity: city.current,
  defaultAddress: address.defaultAddress,
  addresses: address.list,
  defaultHeader: header.defaultHeader
}))
class CreateBill extends Component {
  config = {
    navigationBarTitleText: '开具发票'
  }

  state = {
    address: this.props.defaultAddress,
    header: this.props.defaultHeader,
    price: 0
  }

  componentDidMount() {
    const eventChannel = Taro.getCurrentInstance().page.getOpenerEventChannel()
    eventChannel.on('acceptBillData', ({ ids, price }) => {
      this.ids = ids
      this.setState({
        price
      })
    })
  }

  componentDidShow() {
    const { dispatch } = this.props
    dispatch({
      type: 'address/getUserAddress',
      success: data => {
        if (data) {
          const address = data.find(item => item.set_default)
          this.setState({
            address: address || {}
          })
        }
      }
    })
    dispatch({
      type: 'header/getUserBillHeader',
      success: data => {
        if (data) {
          const header = data.find(item => item.set_default)
          this.setState({
            header: header || {}
          })
        }
      }
    })
  }

  onMoreAddress = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `../address/index?mode=select`
    })
  }

  selectAddress = address => {
    this.setState({ address })
  }

  onMoreHeader = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../headers/index?mode=select'
    })
  }

  handleSave = e => {
    e.stopPropagation()
    const { address, header } = this.state
    if (address && address.id && header && header.id) {
      this.props.dispatch({
        type: 'bill/saveBill',
        payload: {
          order_id_list: this.ids,
          user_dizhi_id: address.id,
          user_fapiao_id: header.id
        },
        success: () => {
          Taro.navigateBack({
            delta: 2
          })
        },
        fail: msg => {
          Taro.showToast({
            title: msg || '提交失败',
            icon: 'none'
          })
        }
      })
    } else {
      Taro.showToast({
        title: '请选择发票抬头以及邮寄地址',
        icon: 'none'
      })
    }
  }

  render() {
    const { address, header, price } = this.state
    return (
      <View
        className='create-bill'
        style={{
          top: 88 + window.$statusBarHeight + 'rpx',
          height: window.$screenHeight - 88 - window.$statusBarHeight + 'rpx'
        }}
      >
        <SysNavBar title='开具发票' />
        <View className='create-bill-label'>发票详情</View>
        {!!header && header.id ? (
          <View className='bill-head-item' onClick={debounce(this.onMoreHeader, 100)}>
            <View className='bill-head-item-title'>
              {header.name}
            </View>
            <View className='bill-head-item-subtitle'>
              {header.num}
            </View>
            <View className='more-head' />
          </View>
        ) : (
          <View className='create-bill-btn' onClick={debounce(this.onMoreHeader, 100)}>去新增发票抬头</View>
        )}
        <View className='create-bill-label'>邮寄地址</View>
        {!!address && address.id ? (
          <View className='address' onClick={debounce(this.onMoreAddress, 100)}>
            <View className='address-icon' />
            <View className='address-details'>
              <Label className='name'>{address.name}</Label>
              <Label className='phone'>{address.mobile}</Label>
              <View className='address-text'>{address.address}</View>
            </View>
            <View className='more-address' />
          </View>
        ) : (
          <View className='create-bill-btn' onClick={debounce(this.onMoreAddress, 100)}>
            去新增邮寄地址
          </View>
        )}

        <View className='create-bill-label'>总金额</View>
        <View className='create-bill-content'>
          <View className='create-bill-content-price'>
            ￥{returnFloat(price)}
          </View>
        </View>
        <View
          className='create-bill-btn create-bill-btn-submit'
          onClick={debounce(this.handleSave, 100)}
        >
          提交
        </View>
      </View>
    )
  }
}

export default CreateBill
