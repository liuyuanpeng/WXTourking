import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, ScrollView, Label } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { connect } from 'react-redux'
import '../../common/index.scss'
import './index.scss'

const homePng = IMAGE_HOST + '/images/bkg3.png'
const daySchedulePng = IMAGE_HOST + '/images/day_schedule.png'
const airCarPng = IMAGE_HOST + '/images/air_car.png'
const routeSchedulePng = IMAGE_HOST + '/images/route_schedule.png'
import ProductItem from '@components/ProductItem'
import DecorateTitle from '@components/DecorateTitle'
import STORAGE from '@constants/storage'
import { debounce } from 'debounce'

@connect(({ coupon }) => ({
  pool: coupon.pool
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '邀请好友'
  }

  componentDidMount() {
    const { user_id } = Taro.getCurrentInstance().router.params
    this.user_id = user_id || ''
    Taro.setStorageSync(STORAGE.USER_FANLI, user_id)
    this.props.dispatch({
      type: 'coupon/getPool',
      payload:{
        coupon_category: 'FANLI'
      }
    })
  }

  handleUse = e => {
    e.stopPropagation()
    Taro.switchTab({
      url: '../home/index'
    })
  }

  render() {
    const {pool} = this.props
    return (
      <View className='new-page' style={{ height: window.$screenHeight + 'rpx' }}>
        <NavBar
          title='邀请好友'
          navigate
          showSearch={false}
          titleStyle={{ color: 'white' }}
        />
        <View className='new-page-title'>我获得的礼包</View>
        <View className='new-coupon'>
          <View className='new-coupon-title'>{pool.name || '新手优惠券'}</View>
          <View className='new-coupon-price'>
            <Label className='new-coupon-price-before'>￥</Label>{pool.price || ''}
          </View>
          <View className='new-coupon-desc'>订单满{pool.limit_price || 0}元</View>
          <View className='new-coupon-desc'>即可抵用</View>
        </View>
        <View className='new-button' onClick={debounce(this.handleUse, 100)}>
          立即使用
        </View>
      </View>
    )
  }
}

export default Home
