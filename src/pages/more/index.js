import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Label } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
import '../common/index.scss'
import './index.less'

import homePng from '../../asset/images/bkg4.png'
import ProductItem from '../../components/ProductItem'
import DecorateTitle from '../../components/DecorateTitle'

@connect(({ system }) => ({
  info: system.info
}))
class More extends Component {
  config = {
    navigationBarTitleText: '旅王出行'
  }

  state = {
    opacity: 0
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

  onSeeMore = e => {
    e.stopPropagation()
    console.log('onSeeMore')
  }

  onMoreScene = e => {
    e.stopPropagation()
    console.log('onMoreScene')
  }

  onMoreFood = e => {
    e.stopPropagation()
    console.log('onMoreFood')
  }

  onMoreGift = e => {
    e.stopPropagation()
    console.log('onMoreGift')
  }

  handleProduct = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../routeDetail/index'
    })
  }

  render() {
    const { windowHeight = 0 } = this.props.info
    if (!windowHeight) return <View></View>
    const scrollStyle = {
      height: `${windowHeight}px`
    }
    const { opacity } = this.state

    const choices = [
      {
        name: '胡里山炮台一日游',
        image: homePng,
        price: 24,
        pointDesc: '4.9分 非常棒'
      },
      {
        name: '厦门科技馆一日游',
        image: homePng,
        price: 122,
        pointDesc: '4.9分 非常棒'
      },
      {
        name: '胡里山炮台一日游',
        image: homePng,
        price: 24,
        pointDesc: '4.9分 非常棒'
      },
      {
        name: '厦门科技馆一日游',
        image: homePng,
        price: 122,
        pointDesc: '4.9分 非常棒'
      },
      {
        name: '胡里山炮台一日游',
        image: homePng,
        price: 24,
        pointDesc: '4.9分 非常棒'
      },
      {
        name: '厦门科技馆一日游',
        icon: homePng,
        price: 122,
        pointDesc: '4.9分 非常棒'
      }
    ]
    const tags = [
      { title: '玩转鼓浪屿' },
      { title: '网红打卡' },
      { title: '陪爸妈' }
    ]

    const scenes = [
      {
        image: '',
        title: '厦门胡里山炮台',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        image: '',
        title: '厦门海底世界',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        image: '',
        title: '厦门鼓浪屿',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        image: '',
        title: '厦门鼓浪屿',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        image: '',
        title: '厦门鼓浪屿',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        image: '',
        title: '厦门鼓浪屿',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        image: '',
        title: '厦门鼓浪屿',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        image: '',
        title: '厦门鼓浪屿',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      }
    ]

    return (
      <View className='page'>
        <NavBar opacity={opacity} showBack />
        <ScrollView
          style={scrollStyle}
          scrollY
          scrollWithAnimation
          onScroll={this.onScroll}
        >
          <View className='bkg' />
          <Image className='home-png' src={homePng} mode='widthFix' />
          <View className='container-choice'>
            <DecorateTitle title='旅王精选' />
            <View className='choice'>
              {choices.map((item, index) => {
                let topText = '000000' + (index + 1)
                topText = topText.substring(topText.length - 2)
                return (
                  <View className='choice-item' key={`choice-item-${index}`}>
                    <Image
                      src={item.image}
                      className='choice-image'
                      mode='aspectFill'
                    />
                    <View className='choice-title'>{item.name}</View>
                    <View className='choice-point'>{item.pointDesc}</View>
                    <Label className='choice-price'>{item.price}</Label>
                    <Label className='choice-qi'>起</Label>
                    <View className='top'>
                      <View>Top</View>
                      <View className='top-text'>{topText}</View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
          <View className='container-choice'>
            <DecorateTitle title='猜你喜欢' />
            <View className='more-tags'>
            {tags.map((item, index) => (
              <AtTag circle className='more-tag'  key={`tag-item-${index}`}>{item.title}</AtTag>
            ))}
            </View>
            {scenes.map((item, index) => (
              <ProductItem onClick={this.handleProduct} key={`scene-item-${index}`} {...item} />
            ))}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default More
