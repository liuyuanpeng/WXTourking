import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import MineListItem from '../../components/MineListItem'
import { connect } from '@tarojs/redux'

import '../common/index.scss'
import './index.scss'

import homePng from '../../asset/images/bkg2.png'

import myBillPng from '../../asset/images/my_bill.png'
import myFavorPng from '../../asset/images/my_favor.png'
import myBalancePng from '../../asset/images/my_balance.png'
import myCommentPng from '../../asset/images/my_comment.png'
import myLikePng from '../../asset/images/my_like.png'
import customerServicePng from '../../asset/images/customer_service.png'
import locationPng from '../../asset/images/location.png'
import inviteGiftPng from '../../asset/images/invite_gift.png'
import myCouponPng from '../../asset/images/my_coupon.png'
import profilePng from '../../asset/images/profile.png'

@connect(({ system }) => ({
  info: system.info
}))
class Home extends PureComponent {
  config = {
    navigationBarTitleText: '我的'
  }

  componentWillMount() {
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
  

  componentDidShow() {
    if (
      Taro.getEnv() === Taro.ENV_TYPE.WEAPP &&
      typeof this.$scope.getTabBar === 'function' &&
      this.$scope.getTabBar()
    ) {
      this.$scope.getTabBar().$component.setState({
        selected: 3
      })
    }
  }

  showAllOrders = e => {
    e.stopPropagation()
    console.log('showAllOrders')
    Taro.navigateTo({
      url: `../allOrders/index`
    })
  }

  showOrder = (index, e) => {
    console.log('index')
    e.stopPropagation()
    Taro.navigateTo({
      url: `../allOrders/index?index=${index}`
    })
  }

  render() {
    const mineList = [
      {
        title: '我的发票',
        icon: myBillPng,
        action: () => {
          Taro.navigateTo({
            url: '../myBill/index'
          })
        }
      },
      {
        title: '我的收藏',
        icon: myFavorPng,
        action: () => {
          Taro.navigateTo({
            url: `../allFavors/index`
          })
        }
      },
      {
        title: '我的余额',
        icon: myBalancePng,
        action: () => {
          Taro.navigateTo({
            url: '../myBalance/index'
          })
        }
      },
      {
        title: '我的评论',
        icon: myCommentPng,
        action: () => {}
      },
      {
        title: '我的点赞',
        icon: myLikePng,
        action: () => {}
      },
      {
        title: '客服中心',
        icon: customerServicePng,
        subtitle: '0592-5550907',
        hideRight: true,
        action: () => {
          Taro.makePhoneCall({
            phoneNumber: '0592-5550907'
          })
        }
      },
      {
        title: '收货地址管理',
        icon: locationPng,
        action: () => {
          Taro.navigateTo({
            url: '../address/index'
          })
        }
      },
      {
        title: '邀请有礼',
        icon: inviteGiftPng,
        action: () => {
          Taro.navigateTo({
            url: '../invite/index'
          })
        }
      },
      {
        title: '我的优惠券',
        icon: myCouponPng,
        action: () => {
          Taro.navigateTo({
            url: '../coupon/index'
          })
        }
      },
      {
        title: '我的资料',
        icon: profilePng,
        action: () => {
          Taro.navigateTo({
            url: '../profile/index'
          })
        }
      }
    ]

    const { windowHeight = 0 } = this.props.info
    if (!windowHeight) return <View></View>
    const scrollStyle = {
      height: `${windowHeight - 50}px`
    }

    return (
      <View className='page-mine'>
        <View className='navigation-bar'>我的</View>

        <ScrollView style={scrollStyle} scrollY scrollWithAnimation>
          <View className='mine-container'>
            <View className='mine-bkg' />
            <View className='mine-header'>
              <Image className='mine-avatar' src={homePng} mode='aspectFill' />
              <View className='mine-info'>
                <View className='mine-nickname'>用户昵称</View>
                <View className='mine-signature'>
                  用户签名用户签名用户签名用户签名用户签名用户签名
                </View>
              </View>
            </View>
            <View className='mine-order-container'>
              <View className='mine-order-title'>我的订单</View>
              <View className='mine-all-order' onClick={this.showAllOrders}>
                全部订单
              </View>
              <View className='mine-order-split' />
              <View className='mine-order-category'>
                <View
                  className='mine-order-category-item'
                  onClick={this.showOrder.bind(this, 1)}
                >
                  <View className='mine-order-icon-1' />
                  <View className='mine-order-category-text'>待付款</View>
                </View>
                <View
                  className='mine-order-category-item'
                  onClick={this.showOrder.bind(this, 2)}
                >
                  <View className='mine-order-icon-2' />
                  <View className='mine-order-category-text'>待出行</View>
                </View>
                <View
                  className='mine-order-category-item'
                  onClick={this.showOrder.bind(this, 3)}
                >
                  <View className='mine-order-icon-3' />
                  <View className='mine-order-category-text'>已完成</View>
                </View>
                <View
                  className='mine-order-category-item'
                  onClick={this.showOrder.bind(this, 4)}
                >
                  <View className='mine-order-icon-4' />
                  <View className='mine-order-category-text'>待评价</View>
                </View>
              </View>
            </View>
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
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Home
