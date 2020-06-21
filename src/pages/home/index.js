import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Label } from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { connect } from '@tarojs/redux'
import '../common/index.scss'
import './index.less'

import homePng from '../../asset/images/bkg3.png'
import daySchedulePng from '../../asset/images/day_schedule.png'
import airCarPng from '../../asset/images/air_car.png'
import routeSchedulePng from '../../asset/images/route_schedule.png'
import ProductItem from '../../components/ProductItem'
import DecorateTitle from '../../components/DecorateTitle'

@connect(({ system }) => ({
  info: system.info
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '旅王出行'
  }

  state = {
    opacity: 0,
    current: 0
  }

  componentDidShow () { 
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP && typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selected: 0
      })
    }  
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
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
      url: `../product/index?type=${detail.type}`
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
    const { windowHeight = 0 } = this.props.info
    if (!windowHeight) return <View></View>
    const scrollStyle = {
      height: `${windowHeight - 50}px`
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

    const scenes = [
      {
        type: 'scene',
        image: '',
        title: '厦门胡里山炮台',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        type: 'scene',
        image: '',
        title: '厦门海底世界',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        type: 'scene',
        image: '',
        title: '厦门鼓浪屿',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      }
    ]

    const foods = [
      {
        type: 'food',
        image: '',
        title: '厦门沙茶面',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        type: 'food',
        image: '',
        title: '厦门海蛎煎',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        type: 'food',
        image: '',
        title: '厦门烧肉粽',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      }
    ]

    const gifts = [
      {
        type: 'gift',
        image: '',
        isGift: true,
        title: '苏小糖牛轧糖',
        pointDesc: '4.9分 非常棒',
        pointTail: '距离我10公里',
        subtitle: '912买过的推荐',
        price: 24
      },
      {
        type: 'gift',
        image: '',
        isGift: true,
        title: '鼓浪屿馅饼',
        pointDesc: '4.9分 非常棒',
        pointTail: '距离我10公里',
        subtitle: '912买过的推荐',
        price: 24
      },
      {
        type: 'gift',
        image: '',
        isGift: true,
        title: '台湾凤梨酥',
        pointDesc: '4.9分 非常棒',
        pointTail: '距离我10公里',
        subtitle: '912买过的推荐',
        price: 24
      }
    ]

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
                <View key={`menu-icon-${index}`} onClick={this.gotoHref.bind(this, item.href)}>
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
                <View className='like-1'></View>
                <View className='like-2-3'>
                  <View className='like-item'></View>
                  <View className='like-item'></View>
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
                    {scenes.map((item, index) => (
                      <ProductItem onClick={this.onSeeProduct.bind(this, item)} key={`scene-item-${index}`} {...item} />
                    ))}
                    <View className='more-btn' onClick={this.onMoreScene}>
                      更多景点
                    </View>
                  </View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={1}>
                  <View>
                    {foods.map((item, index) => (
                      <ProductItem onClick={this.onSeeProduct.bind(this, item)} key={`scene-item-${index}`} {...item} />
                    ))}
                    <View className='more-btn' onClick={this.onMoreFood}>
                      更多美食
                    </View>
                  </View>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={2}>
                  <View>
                    {gifts.map((item, index) => (
                      <ProductItem onClick={this.onSeeProduct.bind(this, item)} key={`scene-item-${index}`} {...item} />
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
