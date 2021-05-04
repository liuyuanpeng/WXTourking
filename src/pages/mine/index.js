import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, ScrollView, Button } from '@tarojs/components'
import MineListItem from '@components/MineListItem'
import { connect } from 'react-redux'

import '../../common/index.scss'
import './index.scss'

const myBillPng = IMAGE_HOST + '/images/my_bill.png'
const myFavorPng = IMAGE_HOST + '/images/my_favor.png'
const myBalancePng = IMAGE_HOST + '/images/my_balance.png'
const myCommentPng = IMAGE_HOST + '/images/my_comment.png'
const myLikePng = IMAGE_HOST + '/images/my_like.png'
const customerServicePng = IMAGE_HOST + '/images/customer_service.png'
const locationPng = IMAGE_HOST + '/images/location.png'
const inviteGiftPng = IMAGE_HOST + '/images/invite_gift.png'
const myCouponPng = IMAGE_HOST + '/images/my_coupon.png'
const profilePng = IMAGE_HOST + '/images/profile.png'
import { AtButton, AtIcon } from 'taro-ui'
import STORAGE from '@constants/storage'
import { debounce } from 'debounce'
import { checkLogin, isLogin } from '../../utils/tool'

@connect(({ user }) => ({
  userInfo: user,
}))
class Mine extends Component {
  config = {
    navigationBarTitleText: '我的',
  }

  componentDidMount() {
    checkLogin()
  }

  componentDidShow() {
    if (isLogin()) {
      this.props.dispatch({
        type: 'user/getUserInfo',
      })
    }
  }

  showAllOrders = (e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `../allOrders/index`,
    })
  }

  showOrder = (index, e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `../allOrders/index?index=${index}`,
    })
  }

  render() {
    const { userInfo } = this.props
    const mineList = [
      {
        title: '我的发票',
        icon: myBillPng,
        action: () => {
          // Taro.navigateTo({
          //   url: '../myBill/index'
          // })
          Taro.navigateTo({
            url: '../billManager/index',
          })
        },
      },
      {
        title: '我的收藏',
        icon: myFavorPng,
        action: () => {
          Taro.navigateTo({
            url: `../allFavors/index`,
          })
        },
      },
      // {
      //   title: '我的余额',
      //   icon: myBalancePng,
      //   action: () => {
      //     Taro.navigateTo({
      //       url: '../myBalance/index'
      //     })
      //   }
      // },
      {
        title: '我的评论',
        icon: myCommentPng,
        action: () => {
          this.props.dispatch({
            type: 'evaluate/getEvaluateList',
            payload: {
              page: 0,
              size: 100,
            },
            success: () => {
              Taro.navigateTo({
                url: '../comments/index',
              })
            },
            fail: (msg) => {
              Taro.showToast({
                title: msg || '获取评论失败',
                icon: 'none',
              })
            },
          })
        },
      },
      {
        title: '我的点赞',
        icon: myLikePng,
        action: () => {
          Taro.navigateTo({
            url: `../allLikes/index`,
          })
        },
      },
      {
        title: '我的客服',
        icon: customerServicePng,
        action: () => {
          Taro.navigateTo({
            url: `../customerService/index`,
          })
        },
      },
      {
        title: '收货地址管理',
        icon: locationPng,
        action: () => {
          Taro.navigateTo({
            url: '../address/index',
          })
        },
      },
      {
        title: '邀请有礼',
        icon: inviteGiftPng,
        action: () => {
          Taro.navigateTo({
            url: '../invite/index',
          })
        },
      },
      {
        title: '我的优惠券',
        icon: myCouponPng,
        action: () => {
          this.props.dispatch({
            type: 'coupon/getCouponList',
            payload: {
              status: 1,
              user_id: Taro.getStorageSync(STORAGE.USER_ID),
            },
            success: () => {
              Taro.navigateTo({
                url: '../coupon/index',
              })
            },
            fail: (msg) => {
              Taro.showToast({
                title: msg || '获取优惠券失败',
                icon: 'none',
              })
            },
          })
        },
      },
      {
        title: '我的资料',
        icon: profilePng,
        action: () => {
          Taro.navigateTo({
            url: '../profile/index',
          })
        },
      },
    ]

    const scrollStyle = {
      height: window.$screenHeight - 690 - window.$statusBarHeight + 'rpx',
      top: window.$statusBarHeight + 590 + 'rpx',
      position: 'absolute',
    }

    const avatarUrl = Taro.getStorageSync(STORAGE.WX_AVATAR)
    const nickName = Taro.getStorageSync(STORAGE.WX_NICKNAME)

    return (
      <View
        className='page-mine'
        style={{
          height: window.$windowHeight + 'rpx',
        }}
      >
        <View
          className='navigation-bar'
          style={{
            height: window.$statusBarHeight + 88 + 'rpx',
          }}
        >
          我的
        </View>
        <View className='mine-bkg' />
        <View
          className='mine-header'
          style={{
            top: window.$statusBarHeight + 108 + 'rpx',
          }}
        >
          {avatarUrl ? (
            <Image className='mine-avatar' src={avatarUrl} mode='aspectFill' />
          ) : (
            <AtIcon className='mine-avatar' size={64} value='user' />
          )}
          <View className='mine-info'>
            <View className='mine-nickname'>
              {nickName || userInfo.name || '昵称未设置'}
            </View>
            <View className='mine-signature'>
              {userInfo.remark || '签名未设置'}
            </View>
          </View>
        </View>
        <View
          className='mine-order-container'
          style={{
            top: window.$statusBarHeight + 302 + 'rpx',
          }}
        >
          <View className='mine-order-title'> 我的订单 </View>
          <View
            className='mine-all-order'
            onClick={debounce(this.showAllOrders, 100)}
          >
            全部订单
          </View>
          <View className='mine-order-split' />
          <View className='mine-order-category'>
            <View
              className='mine-order-category-item'
              onClick={debounce(this.showOrder.bind(this, 1), 100)}
            >
              <View className='mine-order-icon-1' />
              <View className='mine-order-category-text'> 待付款 </View>
            </View>
            <View
              className='mine-order-category-item'
              onClick={debounce(this.showOrder.bind(this, 2), 100)}
            >
              <View className='mine-order-icon-2' />
              <View className='mine-order-category-text'> 待出行 </View>
            </View>
            <View
              className='mine-order-category-item'
              onClick={debounce(this.showOrder.bind(this, 3), 100)}
            >
              <View className='mine-order-icon-3' />
              <View className='mine-order-category-text'> 已完成 </View>
            </View>
            <View
              className='mine-order-category-item'
              onClick={debounce(this.showOrder.bind(this, 4), 100)}
            >
              <View className='mine-order-icon-4' />
              <View className='mine-order-category-text'> 待评价 </View>
            </View>
          </View>
        </View>
        <View className='mine-container'>
          <ScrollView style={scrollStyle} scrollY scrollWithAnimation>
            <View className='mine-list'>
              {mineList.map((item, index) => {
                return (
                  <MineListItem
                    key={`mine-list-item-${index}`}
                    title={item.title}
                    subtitle={item.subtitle}
                    icon={item.icon}
                    hideRight={item.hideRight}
                    onAction={item.action}
                  />
                )
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default Mine
