import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Button, Label } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

const homePng = IMAGE_HOST + '/images/bkg3.png'
const daySchedulePng = IMAGE_HOST + '/images/day_schedule.png'
const airCarPng = IMAGE_HOST + '/images/air_car.png'
const routeSchedulePng = IMAGE_HOST + '/images/route_schedule.png'
import ProductItem from '@components/ProductItem'
import DecorateTitle from '@components/DecorateTitle'
import STORAGE from '@constants/storage'

@connect(({ coupon }) => ({
  pool: coupon.pool
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '邀请好友'
  }

  componentDidMount() {
    const { user_id } = this.$router.params
    this.user_id = user_id || ''
    Taro.setStorageSync(STORAGE.USER_FANLI, user_id)
    this.props.dispatch({
      type: 'coupon/getPool',
      payload: {
        coupon_category: 'FANLI'
      }
    })
  }

  onShareAppMessage = () => {
    var shareObj = {
      title: '旅王出行', // 默认是小程序的名称(可以写slogan等)
      path: '/pages/newUser/index?user_id='+Taro.getStorageSync(STORAGE.USER_ID), // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '',
      success: res => {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          Taro.showToast({
            title: '邀请成功',
            icon: 'success'
          })
        }
      },
      fail: res => {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      }
    } // 返回shareObj
    return shareObj
  }

  render() {
    const { pool } = this.props
    return (
      <View className='new-page' style={{ height: Taro.$windowHeight + 'rpx' }}>
        <NavBar
          title='邀请好友'
          navigate
          showBack
          showSearch={false}
          titleStyle={{ color: 'white' }}
        />
        <View className='new-page-title'>邀请好友 得福利</View>
        <View className='new-page-content'>
          <View className='new-coupon'>
            <View className='new-coupon-title'>现金返利(可提现)</View>
            <View className='new-coupon-price'>
              <Label className='new-coupon-price-before'>￥</Label>
              {pool.fanli || ''}
            </View>
            <View className='new-coupon-tip'>我的福利</View>
            <View className='new-coupon-desc'>邀请好友首次下单成功</View>
            <View className='new-coupon-desc'>即可获得</View>
          </View>
          <View className='new-coupon'>
            <View className='new-coupon-title'>新用户打车优惠券</View>
            <View className='new-coupon-price'>
              <Label className='new-coupon-price-before'>￥</Label>
              {pool.price || ''}
            </View>
            <View className='new-coupon-tip'>好友的福利</View>
            <View className='new-coupon-desc'>首次加入旅王的用户</View>
            <View className='new-coupon-desc'>即可获得</View>
          </View>
        </View>

        <Button className='new-button' open-type='share'>
          立即邀请
        </Button>
      </View>
    )
  }
}

export default Home
