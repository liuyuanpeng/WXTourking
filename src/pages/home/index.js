import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Label } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.less'

const homePng = IMAGE_HOST + '/images/bkg3.png'
const daySchedulePng = IMAGE_HOST + '/images/day_schedule.png'
const airCarPng = IMAGE_HOST + '/images/air_car.png'
const routeSchedulePng = IMAGE_HOST + '/images/route_schedule.png'
import ProductItem from '@components/ProductItem'
import DecorateTitle from '@components/DecorateTitle'
import STORAGE from '@constants/storage'

@connect(({ product, city }) => ({
  hot: product.hot,
  hotJINGDIAN: product.hotJINGDIAN,
  hotMEISHI: product.hotMEISHI,
  hotBANSHOU: product.hotBANSHOU,
  currentCity: city.current
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '旅王出行'
  }

  state = {
    opacity: 0,
    current: 0
  }

  componentDidShow() {
    if (
      Taro.getEnv() === Taro.ENV_TYPE.WEAPP &&
      typeof this.$scope.getTabBar === 'function' &&
      this.$scope.getTabBar()
    ) {
      this.$scope.getTabBar().$component.setState({
        selected: 0
      })
    }
    this.fetchData()
  }

  fetchData = () => {
    if (this.checkLogin()) {
      const { dispatch } = this.props
      dispatch({
        type: 'product/getHotProduct'
      })
      dispatch({
        type: 'product/getHotProduct',
        target: 'hotJINGDIAN'
      })
      dispatch({
        type: 'product/getHotProduct',
        target: 'hotMEISHI'
      })
      dispatch({
        type: 'product/getHotProduct',
        target: 'hotBANSHOU'
      })
    }
  }

  checkLogin = () => {
    return Taro.getStorageSync(STORAGE.TOKEN) || false
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
  }

  gotoLogin = () => {
    Taro.navigateTo({
      url: '../../pagesLogin/login/index'
    })
  }

  componentWillMount() {
    // 判断是否登录小程序
    Taro.checkSession({
      success: () => {
        // 尝试获取/更新微信信息
        Taro.getUserInfo({
          lang: 'zh_CN',
          success: res => {
            const app = Taro.getApp()
            app.globalData.wxInfo = { ...res.userInfo }
          }
        })
        // 判断是否登录旅王系统
        if (Taro.getStorageSync(STORAGE.TOKEN)) {
          // 获取用户信息
          this.props.dispatch({
            type: 'user/getUserInfo'
          })

          this.props.dispatch({
            type: 'carTypes/getCarTypes'
          })

          this.props.dispatch({
            type: 'sit/getSitList'
          })

          this.props.dispatch({
            type: 'city/getCityList',
            success: () => {
              this.fetchData()
            }
          })
        } else {
          this.gotoLogin()
        }
      },
      fail: () => {
        this.gotoLogin()
      }
    })
  }

  onScroll = e => {
    const rate = e.detail.scrollTop / 200
    const opacity = rate > 0.8 ? 0.8 : rate
    this.setState({
      opacity
    })
  }

  onSeeProduct = (detail, e) => {
    console.log('onSeeProduct: ', detail)
    e.stopPropagation()
    Taro.navigateTo({
      url: `../product/index`,
      success: res => {
        res.eventChannel.emit('acceptProductData', {
          ...detail
        })
      }
    })
  }
  onSeeMore = e => {
    e.stopPropagation()
    console.log('onSeeMore')
    Taro.navigateTo({
      url: '../more/index'
    })
  }

  onMoreScene = e => {
    e.stopPropagation()
    console.log('onMoreScene')
    Taro.navigateTo({
      url: `../moreProduct/index?type=scene`
    })
  }

  onMoreFood = e => {
    e.stopPropagation()
    console.log('onMoreFood')
    Taro.navigateTo({
      url: `../moreProduct/index?type=food`
    })
  }

  onMoreGift = e => {
    e.stopPropagation()
    console.log('onMoreGift')

    Taro.navigateTo({
      url: `../moreProduct/index?type=gift`
    })
  }

  gotoHref = href => {
    Taro.navigateTo({
      url: `../${href}/index`
    })
  }

  render() {
    const scrollStyle = {
      height: `${Taro.$windowHeight - 100}rpx`
    }
    const { opacity } = this.state

    const icons = [
      {
        name: '按天包车',
        icon: daySchedulePng,
        href: 'dayChartered'
      },
      {
        name: '接送机',
        icon: airCarPng,
        href: 'airport'
      },
      {
        name: '线路包车',
        icon: routeSchedulePng,
        href: 'more'
      }
    ]
    const tabList = [
      { title: '热门景点' },
      { title: '人气美食' },
      { title: '伴手礼' }
    ]




    const {
      hot,
      hotJINGDIAN,
      hotMEISHI,
      hotBANSHOU,
      currentCity = {name: ''}
    } = this.props

    return (
      <View className='page'>
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
              <Label onClick={this.onSeeMore} className='see-more'>
                查看更多
              </Label>
              <View className='guess-you-like-container'>
                {hot && hot[0] && (
                  <View className='like-1'>
                    <Image
                      className='like-image'
                      src={hot[0].private_consume.images.split(',')[0]}
                    />
                    <View className='like-tag'>
                {currentCity.name}{' '}{hot[0].private_consume.tag}
                    </View>
                    <View className='like-name'>
                      {hot[0].private_consume.name}
                    </View>
                  </View>
                )}
                <View className='like-2-3'>
                  {hot && hot[1] && (
                    <View className='like-item'>
                      <Image
                        className='like-image'
                        src={hot[1].private_consume.images.split(',')[1]}
                      />

                      <View className='like-tag'>
                        {currentCity.name}{' '}{hot[2].private_consume.tag}
                      </View>
                      <View className='like-name'>
                        {hot[1].private_consume.name}
                      </View>
                    </View>
                  )}
                  {hot && hot[2] && (
                    <View className='like-item'>
                      <Image
                        className='like-image'
                        src={hot[2].private_consume.images.split(',')[2]}
                      />
                      <View className='like-tag'>
                        {currentCity.name}{' '}{hot[2].private_consume.tag}
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
                        onClick={this.onSeeProduct.bind(this, item)}
                        key={`scene-item-${index}`}
                        type='scene'
                        image={item.private_consume.images.split(',')[0]}
                        title={item.private_consume.name}
                        pointDesc={`${item.private_consume.evaluate_score || 0}分 非常棒`}
                        pointTail={`${item.private_consume.evaluate_count || 0}条点评`}
                        subtitle={currentCity.name+'市'}
                        endTitle={item.private_consume.tag || ''}
                      />
                    ))}
                    <View className='more-btn' onClick={this.onMoreScene}>
                      更多景点
                    </View>
                  </View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={1}>
                  <View>
                    {hotMEISHI.map((item, index) => (
                      <ProductItem
                        onClick={this.onSeeProduct.bind(this, item)}
                        key={`scene-item-${index}`}
                        type='food'
                        image={item.private_consume.images.split(',')[0]}
                        title={item.private_consume.name}
                        pointDesc={`${item.private_consume.evaluate_score || 0}分 非常棒`}
                        pointTail={`${item.private_consume.evaluate_count || 0}条点评`}
                        subtitle={currentCity.name+'市'}
                        endTitle={item.private_consume.description || '未设置描述'}
                      />
                    ))}
                    <View className='more-btn' onClick={this.onMoreFood}>
                      更多美食
                    </View>
                  </View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={2}>
                  <View>
                    {hotBANSHOU.map((item, index) => (
                      <ProductItem
                        onClick={this.onSeeProduct.bind(this, item)}
                        key={`scene-item-${index}`}
                        type='gift'
                        image={item.private_consume.images.split(',')[0]}
                        title={item.private_consume.name}
                        pointDesc={`${item.private_consume.evaluate_score || 0}分 非常棒`}
                        pointTail={`${item.private_consume.evaluate_count || 0}条点评`}
                        subtitle={(item.private_consume.recommend_count || 0)+'买过的推荐'}
                        price={item.private_consume.price || '未定价'}
                      />
                    ))}
                    <View className='more-btn' onClick={this.onMoreGift}>
                      更多伴手礼
                    </View>
                  </View>
                </AtTabsPane>
              </AtTabs>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Home
