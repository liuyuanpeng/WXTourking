import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  ScrollView
} from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
// import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import ProductItem from '@components/ProductItem'
import { debounce } from 'debounce'

@connect(({ product, city }) => ({
  JINGDIAN: product.JINGDIAN,
  MEISHI: product.MEISHI,
  BANSHOU: product.BANSHOU,
  currentCity: city.current
}))
class MoreProduct extends Component {
  config = {
    navigationBarTitleText: '显示更多'
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

  componentDidMount() {
    const type = this.$router.params.type
    this.setState({
      current: type === 'gift' ? 2 : type === 'food' ? 1 : 0
    })
    this.fetchData()
  }

  fetchData() {
    const { dispatch } = this.props
    dispatch({
      type: 'product/getProductList',
      target: 'JINGDIAN'
    })
    dispatch({
      type: 'product/getProductList',
      target: 'MEISHI'
    })
    dispatch({
      type: 'product/getProductList',
      target: 'BANSHOU'
    })
  }

  onSeeProduct = (detail, e)=> {
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

  render() {
    const tabList = [
      { title: '热门景点' },
      { title: '人气美食' },
      { title: '伴手礼' }
    ]

    const { JINGDIAN, MEISHI, BANSHOU, currentCity = { name: '' } } = this.props

    const scrollStyle = {
      height: `${Taro.$windowHeight - Taro.$statusBarHeight - 88 - 88}rpx`
    }

    return (
      <View
        className='more-product-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='' />
        <View className='more-product-tabs'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {JINGDIAN.map(item => (
                  <ProductItem
                    onClick={debounce(this.onSeeProduct.bind(this, item), 100)}
                    key={`scene-item-${item.private_consume.id}`}
                    type='scene'
                    image={item.private_consume.images.split(',')[0]}
                    title={item.private_consume.name}
                    pointDesc={`${item.private_consume.evaluate_score ||
                      0}分 ${item.private_consume.evaluate_score>=7?'非常棒': ''}`}
                    pointTail={`${item.private_consume.evaluate_count ||
                      0}条点评`}
                    subtitle={currentCity.name + '市'}
                    endTitle={item.private_consume.description || '未设置描述'}
                  />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {MEISHI.map(item => (
                  <ProductItem
                    onClick={debounce(this.onSeeProduct.bind(this, item), 100)}
                    key={`scene-item-${item.private_consume.id}`}
                    type='food'
                    image={item.private_consume.images.split(',')[0]}
                    title={item.private_consume.name}
                    pointDesc={`${item.private_consume.evaluate_score ||
                      0}分 ${item.private_consume.evaluate_score>=7?'非常棒': ''}`}
                    pointTail={`${item.private_consume.evaluate_count ||
                      0}条点评`}
                    subtitle={currentCity.name + '市'}
                    endTitle={item.private_consume.description || '未设置描述'}
                  />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {BANSHOU.map(item => (
                  <ProductItem
                    onClick={debounce(this.onSeeProduct.bind(this, item), 100)}
                    key={`scene-item-${item.private_consume.id}`}
                    type='gift'
                    image={item.private_consume.images.split(',')[0]}
                    title={item.private_consume.name}
                    pointDesc={`${item.private_consume.evaluate_score ||
                      0}分 ${item.private_consume.evaluate_score>=7?'非常棒': ''}`}
                    pointTail={`${item.private_consume.evaluate_count ||
                      0}条点评`}
                    // subtitle={
                    //   (item.private_consume.recommend_count || 0) + '买过的推荐'
                    // }
                    price={item.private_consume.price || '未定价'}
                  />
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
