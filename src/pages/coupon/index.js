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
import CouponItem from '@components/CouponItem'
import dayjs from 'dayjs'
import STORAGE from '@constants/storage'
import { debounce } from 'debounce'
import { isLogin } from '../../utils/tool'

@connect(({ coupon }) => ({
  list: coupon.list,
  usedList: coupon.usedList,
  overdueList: coupon.overdueList,
  usableList: coupon.usableList
}))
class Coupon extends Component {
  config = {
    navigationBarTitleText: '我的优惠券'
  }

  state = {
    current: 0,
    canEdit: false,
    price: 0
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })


    this.props.dispatch({
      type: 'coupon/getCouponList',
      payload: {
        status: value + 1,
        user_id: Taro.getStorageSync(STORAGE.USER_ID)
      }
    })

  }

  obtainCoupon = e => {
    e.stopPropagation()
    // 获取满减优惠券池
    this.props.dispatch({
      type: 'coupon/getPool',
      payload: {
        coupon_category: 'MANJIAN'
      },
      success: pool => {
        if (pool && pool.id) {
          this.props.dispatch({
            type: 'coupon/obtainCoupon',
            payload: {
              mobile: Taro.getStorageSync(STORAGE.USER_PHONE),
              coupon_pool_id: pool.id
            },
            success: () => {
              this.fetchData()
              Taro.showToast({
                title: '获取优惠券成功',
                icon: 'none'
              })
            },
            fail: msg => {
              Taro.showToast({
                title: msg || '没有更多优惠券了',
                icon: 'none'
              })
            }
          })
        } else {
          Taro.showToast({
            title: '没有更多优惠券了',
            icon: 'none'
          })
        }
      },
      fail: msg => {
        Taro.showToast({
          title: msg || '获取优惠券池失败',
          icon: 'none'
        })
      }
    })
  }

  componentDidMount() {
    if (!isLogin()) {
      return
    }
    const { dispatch } = this.props
    const user_id = Taro.getStorageSync(STORAGE.USER_ID)
    if (!user_id) return
    dispatch({
      type: 'coupon/getCouponList',
      payload: {
        status: 1,
        user_id
      }
    })
    if (Taro.getCurrentInstance().router.params.canEdit && Taro.getCurrentInstance().router.params.price) {
      this.setState({
        canEdit: true,
        price: parseFloat(Taro.getCurrentInstance().router.params.price)
      })
    }
  }

  fetchData = () => {
    const { dispatch } = this.props
    const user_id = Taro.getStorageSync(STORAGE.USER_ID)
    if (!user_id) return
    const {canEdit, price} = this.state
    if (canEdit && price) {
      dispatch({
        type: 'coupon/getUsableCoupon',
        payload: {
          price,
          user_id
        }
      })
    } else {
      dispatch({
        type: 'coupon/getCouponList',
        payload: {
          status: 1,
          user_id
        }
      })
    }
  }

  onSelect(coupon) {
    const eventChannel = Taro.getCurrentInstance().page.getOpenerEventChannel()
    eventChannel.emit('acceptCoupon', { ...coupon })
    Taro.navigateBack()
  }

  render() {
    const { canEdit } = this.state

    const tabList = [
      { title: canEdit ? '可使用' : '未使用' },
      { title: '已使用' },
      { title: '已过期' }
    ]

    const { list, usedList, overdueList, usableList } = this.props

    const scrollStyle = {
      height: `${window.$screenHeight - window.$statusBarHeight - 276}rpx`
    }

    return (
      <View
        className='all-coupon-page'
        style={{ top: 88 + window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='我的优惠券' />
        <View className='all-coupon-tabs'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {(canEdit ? usableList : list).map((item, index) => (
                  <CouponItem
                    onSelect={canEdit ? this.onSelect.bind(this, item) : null}
                    type='effective'
                    key={`coupon-item-${index}`}
                    {...item}
                  />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {usedList.map((item, index) => (
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
                {overdueList.map((item, index) => (
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
        {/* <View className='coupon-bottom'>
          特别提示：每个用户1天最多使用2张优惠券
        </View> */}
        <View className='coupon-button' onClick={debounce(this.obtainCoupon, 100)}>
          领取更多优惠券
        </View>
      </View>
    )
  }
}

export default Coupon
