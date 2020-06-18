import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
// import '../common/index.less'
import './index.scss'

import daySchedulePng from '../../asset/images/day_schedule.png'
import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane } from 'taro-ui'
import CommentItem from '../../components/CommentItem'
import SysNavBar from '../../components/SysNavBar'
import {returnFloat} from '../../utils/tool'
import ProductItem from '../../components/ProductItem'

@connect(({ system }) => ({
  info: system.info
}))
class MoreProduct extends Component {
  config = {
    navigationBarTitleText: '订单支付'
  }

  state = {
    current: 0
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
  }

  componentWillMount() {
    if (this.props.info.windowHeight) return
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

  componentDidMount() {
    const type = this.$router.params.type
    this.setState({
      current: type === 'gift' ? 2 : (type === 'food' ? 1 : 0)
    })
  }
  

  onSeeProduct = (item, e) => {
    e.stopPropagation();
    console.log('onSeeProduct: ', item)
    Taro.navigateTo({
      url: `../product/index?type=${item.type}`
    })
  }
  
  render() {
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
        title: '厦门胡里山炮台',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
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
        title: '厦门胡里山炮台',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
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
        title: '厦门胡里山炮台',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
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
        title: '厦门胡里山炮台',
        pointDesc: '4.9分 非常棒',
        pointTail: '2015条点评',
        subtitle: '厦门市 | 湖里区',
        endTitle: '八闽门户，天南锁钥'
      },
      {
        type: 'scene',
        image: '',
        title: 'END',
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

    const { windowHeight = 0 } = this.props.info
    if (!windowHeight) return <View></View>
    const scrollStyle = {
      height: `${windowHeight - 128}px`
    }

    return (
      <View className='more-product-page'>
        <SysNavBar title='' />
        <View className='more-product-tabs'>
              <AtTabs
                current={this.state.current}
                tabList={tabList}
                onClick={this.handleClick}
              >
                <AtTabsPane current={this.state.current} index={0}>
                  <ScrollView scrollY style={scrollStyle}>
                    {scenes.map((item, index) => (
                      <ProductItem onClick={this.onSeeProduct.bind(this, item)} key={`scene-item-${index}`} {...item} />
                    ))}
                  </ScrollView>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={1}>
                <ScrollView scrollY style={scrollStyle}>
                    {foods.map((item, index) => (
                      <ProductItem onClick={this.onSeeProduct.bind(this, item)} key={`scene-item-${index}`} {...item} />
                    ))}
                  </ScrollView>
                </AtTabsPane>
                <AtTabsPane current={this.state.current} index={2}>
                <ScrollView scrollY style={scrollStyle}>
                   {gifts.map((item, index) => (
                      <ProductItem onClick={this.onSeeProduct.bind(this, item)} key={`scene-item-${index}`} {...item} />
                    ))}
                  </ScrollView>
                </AtTabsPane>
              </AtTabs>
            </View>
         
      </View>
    )
  }
}

export default MoreProduct
