import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, ScrollView, Label } from '@tarojs/components'
import NavBar from '../../components/NavBar'
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
import QQMapWX from '../utilPages/location/qqmap'
import ModalView from '../../components/ModalView'
import dayjs from 'dayjs'
import { debounce } from 'debounce'
import { checkLogin } from '../../utils/tool'

let qqMapSDK = null

@connect(({ product, city, user }) => ({
  hot: product.hot,
  hotJINGDIAN: product.hotJINGDIAN,
  hotMEISHI: product.hotMEISHI,
  hotBANSHOU: product.hotBANSHOU,
  currentCity: city.current,
  user: user,
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '旅王出行',
  }

  state = {
    opacity: 0,
    current: 0,
    visible: false,
  }

  componentDidShow() {
    this.props.dispatch({
      type: 'city/getCityList',
      success: (city) => {
        this.props.dispatch({
          type: 'carTypes/getCarTypes',
          success: () => {
            this.props.dispatch({
              type: 'sit/getSitList',
              success: () => {
                this.fetchData(city)
                this.getCoupon()
              },
            })
          },
        })
      },
    })

    // 显示活动页面
    const today = dayjs()
      .startOf('day')
      .valueOf()
    const last = parseInt(Taro.getStorageSync(STORAGE.AD_TIME))
    if (today !== last) {
      this.showAD(true)
    }
  }

  getCoupon = () => {
    if (this.checkLogin()) {
      const { dispatch } = this.props
      // 被邀请用户优惠券
      if (Taro.getStorageSync(STORAGE.USER_FANLI)) {
        // 获取池
        dispatch({
          type: 'coupon/getPool',
          payload: {
            coupon_category: 'FANLI',
          },
          success: (pool) => {
            if (pool && pool.id) {
              dispatch({
                type: 'coupon/obtainCoupon',
                payload: {
                  mobile: Taro.getStorageSync(STORAGE.USER_PHONE),
                  user_id: Taro.getStorageSync(STORAGE.USER_FANLI),
                  coupon_pool_id: pool.id,
                },
                success: () => {
                  Taro.setStorageSync(STORAGE.USER_FANLI, 1)
                },
              })
            }
          },
        })
      }

      // 获取新用户优惠券
      if (!Taro.getStorageSync(STORAGE.OLD_USER)) {
        // 获取池
        dispatch({
          type: 'coupon/getPool',
          payload: {
            coupon_category: 'XINYONGHU',
          },
          success: (pool) => {
            if (pool && pool.id) {
              dispatch({
                type: 'coupon/obtainCoupon',
                payload: {
                  mobile: Taro.getStorageSync(STORAGE.USER_PHONE),
                  coupon_pool_id: pool.id,
                },
                success: () => {
                  Taro.setStorageSync(STORAGE.OLD_USER, 1)
                },
              })
            }
          },
        })
      }
    }
  }

  fetchData = (city) => {
    const { dispatch } = this.props
    dispatch({
      type: 'product/getHotProduct',
      city,
    })
    dispatch({
      type: 'product/getHotProduct',
      target: 'hotJINGDIAN',
      city,
    })
    dispatch({
      type: 'product/getHotProduct',
      target: 'hotMEISHI',
      city,
    })
    dispatch({
      type: 'product/getHotProduct',
      target: 'hotBANSHOU',
      city,
    })
  }

  checkLogin = () => {
    return Taro.getStorageSync(STORAGE.TOKEN) || false
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value,
    })
  }

  showAD = (visible) => {
    if (!visible) {
      Taro.setStorageSync(
        STORAGE.AD_TIME,
        dayjs()
          .startOf('day')
          .valueOf()
      )
    }
    this.setState({
      visible,
    })
  }

  componentDidMount() {
    Taro.checkSession({
      success: () => {
        // 判断是否有code
        if (!Taro.getStorageSync(STORAGE.OPEN_ID)) {
          this.login2WX()
        }
        // 判断是否登录旅王系统
        if (this.checkLogin()) {
          // 获取用户信息
          this.props.dispatch({
            type: 'user/getUserInfo',
          })
        }
      },
      fail: () => {
        // session_key过期，删除老的session_key
        Taro.removeStorageSync(STORAGE.SESSION_KEY)
        // 获取code、open_id、session_key
        this.login2WX()
      },
    })

    const publicity = Taro.getCurrentInstance().router.params.scene
    if (publicity) {
      const driverIndex = publicity.indexOf('driver')
      if (publicity === 'coupon') {
        Taro.navigateTo({
          url: `../coupon/index`,
        })
      } else if (driverIndex != -1) {
        // 司机推荐
        Taro.setStorageSync(
          STORAGE.SOURCE_DRIVER_ID,
          publicity.substring(driverIndex + 7)
        )
        // 跳转接送机下单页面
        // this.gotoAirport()
      } else {
        if (publicity) {
          Taro.setStorageSync(STORAGE.SOURCE_SHOP_ID, publicity)
          // 统计扫码用户
          this.props.dispatch({
            type: 'user/scanCount',
          })
          // 跳转接送机下单页面
          // this.gotoAirport()
        }
      }
    }

    // 获取城市
    qqMapSDK = new QQMapWX({
      key: 'JTKBZ-LCG6U-GYOVE-BJMJ5-E3DA5-HTFAJ', // 必填
    })
    Taro.getLocation({
      type: 'gcj02',
      success: (loc) => {
        qqMapSDK.reverseGeocoder({
          //逆地址解析（经纬度 ==> 坐标位置）
          location: loc,
          success: (result) => {
            let curCity = result.result.ad_info.city
            curCity = curCity.substr(0, curCity.length - 1)
            this.props.dispatch({
              type: 'city/setCurrent',
              name: curCity,
            })
          },
        })
      },
    })
  }

  login2WX = () => {
    Taro.login({
      success: (res) => {
        Taro.setStorageSync(STORAGE.USER_CODE, res.code)
        this.fetchSession()
      },
      fail: () => {
        setTimeout(() => {
          this.login2WX()
        }, 200)
      },
    })
  }

  fetchSession = () => {
    this.props.dispatch({
      type: 'user/getSession',
      success: () => {
        console.log('获取session成功')
      },
      refetch: () => {
        setTimeout(() => {
          this.fetchSession()
        }, 200)
      },
      fail: (msg) => {
        Taro.showToast({
          title: msg || '获取session失败，请稍后重试。',
          icon: 'none',
        })
      },
    })
  }

  onScroll = (e) => {
    const rate = e.detail.scrollTop / 200
    const opacity = rate > 0.8 ? 0.8 : rate
    this.setState({
      opacity,
    })
  }

  onSeeProduct = (detail, e) => {
    e.stopPropagation()
    const { private_consume } = detail
    const { scene } = private_consume
    if (scene === 'ROAD_PRIVATE') {
      Taro.navigateTo({
        url: '../routeDetail/index',
        success: (res) => {
          res.eventChannel.emit('roadData', {
            ...detail,
          })
        },
      })
    } else {
      Taro.navigateTo({
        url: `../product/index`,
        success: (res) => {
          res.eventChannel.emit('acceptProductData', {
            ...detail,
          })
        },
      })
    }
  }

  onSeeMore = (e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../more/index',
    })
  }

  onMoreScene = (e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `../moreProduct/index?type=scene`,
    })
  }

  onMoreFood = (e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: `../moreProduct/index?type=food`,
    })
  }

  onMoreGift = (e) => {
    e.stopPropagation()

    Taro.navigateTo({
      url: `../moreProduct/index?type=gift`,
    })
  }

  gotoAirport = () => {
    setTimeout(() => {
      Taro.showToast({
        title: 'navigate...',
        icon: 'none',
      })
      this.gotoHref('airport')
    }, 500)
  }

  gotoHref = (href) => {
    Taro.navigateTo({
      url: `../${href}/index`,
    })
  }

  handleJoin = (e) => {
    e.stopPropagation()
    if (!checkLogin()) {
      return
    }
    Taro.setStorageSync(
      STORAGE.AD_TIME,
      dayjs()
        .startOf('day')
        .valueOf()
    )
    Taro.navigateTo({
      url: '../invite/index',
    })
    this.setState({
      visible: false,
    })
  }

  updateWXInfo = (userInfo) => {
    const { nickName, avatarUrl } = userInfo
    Taro.setStorageSync(STORAGE.WX_AVATAR, avatarUrl)
    Taro.setStorageSync(STORAGE.WX_NICKNAME, nickName)
    if (this.checkLogin()) {
      const { user, dispatch } = this.props
      // 更新用户信息
      dispatch({
        type: 'user/updateUserInfo',
        payload: {
          user_id: user.id,
          avatar: avatarUrl,
          nick_name: nickName,
        },
      })
    }
  }

  handleGlobalClick = (e) => {
    e.stopPropagation()
    if (Taro.getStorageSync(STORAGE.WX_NICKNAME)) {
      // 已有用户信息，返回
      return
    }
    // 获取用户信息
    if (Taro.canIUse('getUserProfile')) {
      Taro.getUserProfile({
        desc: '用于完善乘客资料',
        lang: 'zh_CN',
        success: (res) => {
          const { userInfo = {} } = res
          this.updateWXInfo(userInfo)
        },
      })
    } else {
      Taro.getUserInfo({
        lang: 'zh_CN',
        success: (res) => {
          const { userInfo = {} } = res
          this.updateWXInfo(userInfo)
        },
      })
    }
  }

  render() {
    const scrollStyle = {
      height: `${window.$windowHeight}rpx`,
    }
    const { opacity, visible } = this.state

    const icons = [
      {
        name: '按天包车',
        icon: daySchedulePng,
        href: 'dayChartered',
      },
      {
        name: '接送机',
        icon: airCarPng,
        href: 'airport',
      },
      {
        name: '线路包车',
        icon: routeSchedulePng,
        href: 'more',
      },
    ]
    const tabList = [
      { title: '热门景点' },
      { title: '人气美食' },
      { title: '伴手礼' },
    ]

    const {
      hot,
      hotJINGDIAN,
      hotMEISHI,
      hotBANSHOU,
      currentCity = { name: '' },
    } = this.props

    return (
      <View className='page' onClick={this.handleGlobalClick}>
        <NavBar opacity={opacity} title='旅王出行' navigate />
        <ScrollView
          style={scrollStyle}
          scrollY
          scrollWithAnimation
          onScroll={this.onScroll}
        >
          <Image className='common-image' src={homePng} mode='widthFix' />
          <View className='container'>
            <View className='menu'>
              {icons.map((item, index) => (
                <View
                  key={`menu-icon-${index}`}
                  onClick={this.gotoHref.bind(this, item.href)}
                >
                  <Image
                    className='icon-image'
                    src={item.icon}
                    mode='aspectFit'
                  />
                  <Label className='icon-label'>{item.name}</Label>
                </View>
              ))}
            </View>
            <View className='guess-you-like'>
              <DecorateTitle title='猜你喜欢' />
              <Label
                onClick={debounce(this.onSeeMore, 100)}
                className='see-more'
              >
                查看更多
              </Label>
              <View className='guess-you-like-container'>
                {hot && hot[0] && (
                  <View
                    className='like-1'
                    onClick={debounce(
                      this.onSeeProduct.bind(this, hot[0]),
                      100
                    )}
                  >
                    <Image
                      className='like-image'
                      mode='widthFix'
                      src={hot[0].private_consume.images.split(',')[0]}
                    />
                    <View className='like-tag'>
                      {currentCity.name} {hot[0].private_consume.tag}
                    </View>
                    <View className='like-name'>
                      {hot[0].private_consume.name}
                    </View>
                  </View>
                )}
                <View className='like-2-3'>
                  {hot && hot[1] && (
                    <View
                      className='like-item'
                      onClick={debounce(
                        this.onSeeProduct.bind(this, hot[1]),
                        100
                      )}
                    >
                      <Image
                        className='like-image'
                        mode='widthFix'
                        src={hot[1].private_consume.images.split(',')[1]}
                      />

                      <View className='like-tag'>
                        {currentCity.name} {hot[2].private_consume.tag}
                      </View>
                      <View className='like-name'>
                        {hot[1].private_consume.name}
                      </View>
                    </View>
                  )}
                  {hot && hot[2] && (
                    <View
                      className='like-item'
                      onClick={debounce(
                        this.onSeeProduct.bind(this, hot[2]),
                        100
                      )}
                    >
                      <Image
                        className='like-image'
                        mode='widthFix'
                        src={hot[2].private_consume.images.split(',')[2]}
                      />
                      <View className='like-tag'>
                        {currentCity.name} {hot[2].private_consume.tag}
                      </View>
                      <View className='like-name'>
                        {hot[2].private_consume.name}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View className='tabs'>
              <AtTabs
                current={this.state.current}
                tabList={tabList}
                onClick={this.handleClick}
              >
                <AtTabsPane current={this.state.current} index={0}>
                  <View>
                    {hotJINGDIAN.map((item, index) => (
                      <ProductItem
                        onClick={debounce(
                          this.onSeeProduct.bind(this, item),
                          100
                        )}
                        key={`scene-item-${index}`}
                        type='scene'
                        image={item.private_consume.images.split(',')[0]}
                        title={item.private_consume.name}
                        pointDesc={`${item.private_consume.evaluate_score ||
                          0}分 ${
                          item.private_consume.evaluate_score >= 7
                            ? '非常棒'
                            : ''
                        }`}
                        pointTail={`${item.private_consume.evaluate_count ||
                          0}条点评`}
                        subtitle={currentCity.name + '市'}
                        endTitle={item.private_consume.tag || ''}
                      />
                    ))}
                    <View
                      className='more-btn'
                      onClick={debounce(this.onMoreScene, 100)}
                    >
                      更多景点
                    </View>
                  </View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={1}>
                  <View>
                    {hotMEISHI.map((item, index) => (
                      <ProductItem
                        onClick={debounce(
                          this.onSeeProduct.bind(this, item),
                          100
                        )}
                        key={`scene-item-${index}`}
                        type='food'
                        image={item.private_consume.images.split(',')[0]}
                        title={item.private_consume.name}
                        pointDesc={`${item.private_consume.evaluate_score ||
                          0}分 ${
                          item.private_consume.evaluate_score >= 7
                            ? '非常棒'
                            : ''
                        }`}
                        pointTail={`${item.private_consume.evaluate_count ||
                          0}条点评`}
                        subtitle={currentCity.name + '市'}
                        endTitle={
                          item.private_consume.description || '未设置描述'
                        }
                      />
                    ))}
                    <View
                      className='more-btn'
                      onClick={debounce(this.onMoreFood, 100)}
                    >
                      更多美食
                    </View>
                  </View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={2}>
                  <View>
                    {hotBANSHOU.map((item, index) => (
                      <ProductItem
                        onClick={debounce(
                          this.onSeeProduct.bind(this, item),
                          100
                        )}
                        key={`scene-item-${index}`}
                        type='gift'
                        image={item.private_consume.images.split(',')[0]}
                        title={item.private_consume.name}
                        pointDesc={`${item.private_consume.evaluate_score ||
                          0}分 ${
                          item.private_consume.evaluate_score >= 7
                            ? '非常棒'
                            : ''
                        }`}
                        pointTail={`${item.private_consume.evaluate_count ||
                          0}条点评`}
                        // subtitle={(item.private_consume.recommend_count || 0)+'买过的推荐'}
                        price={item.private_consume.price || '未定价'}
                      />
                    ))}
                    <View
                      className='more-btn'
                      onClick={debounce(this.onMoreGift, 100)}
                    >
                      更多伴手礼
                    </View>
                  </View>
                </AtTabsPane>
              </AtTabs>
            </View>
          </View>
        </ScrollView>
        <ModalView visible={visible} onClose={this.showAD.bind(this, false)}>
          <View className='ad-content'>
            <View className='ad-content-image' />
            <View className='ad-content-text'>邀请好友送打车券</View>
            <View className='ad-content-btn' onClick={this.handleJoin}>
              立即参与
            </View>
          </View>
        </ModalView>
      </View>
    )
  }
}

export default Home
