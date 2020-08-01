import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Label } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../asset/common/index.scss'
import './index.less'

import homePng from '@images/bkg4.png'
import ProductItem from '@components/ProductItem'
import DecorateTitle from '@components/DecorateTitle'

@connect(({ product, city }) => ({
  list: product.list,
  recommend: product.recommend,
  currentCity: city.current
}))
class More extends Component {
  config = {
    navigationBarTitleText: '旅王出行'
  }

  state = {
    opacity: 0
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    const { dispatch } = this.props
    dispatch({
      type: 'product/getProductList',
      target: 'list'
    })
    dispatch({
      type: 'product/getHotProduct',
      target: 'recommend'
    })
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

  handleProduct = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../routeDetail/index'
    })
  }

  render() {
    const scrollStyle = {
      height: `${Taro.$windowHeight}rpx`
    }
    const { opacity } = this.state

    const { list, recommend, currentCity } = this.props

    return (
      <View className='page'>
        <NavBar opacity={opacity} showBack />
        <View className='bkg' />
        <ScrollView
          style={scrollStyle}
          scrollY
          scrollWithAnimation
          onScroll={this.onScroll}
        >
          <Image
            className='home-png'
            style={{ marginTop: Taro.$statusBarHeight + 220 + 'rpx' }}
            src={homePng}
            mode='widthFix'
          />
          <View className='container-choice'>
            <DecorateTitle title='旅王精选' />
            <View className='choice'>
              {recommend.map((item, index) => {
                let topText = '000000' + (index + 1)
                topText = topText.substring(topText.length - 2)
                return (
                  <View className='choice-item' key={`choice-item-${index}`}>
                    <Image
                      src={item.private_consume.images.split(',')[0]}
                      className='choice-image'
                      mode='aspectFill'
                    />
                    <View className='choice-title'>
                      {item.private_consume.name}
                    </View>
                    <View className='choice-point'>{`${item.private_consume
                      .evaluate_score || 0}分 非常棒`}</View>
                    {item.private_consume.price && (
                      <View>
                        <Label className='choice-price'>
                          {item.private_consume.price || 0}
                        </Label>
                        <Label className='choice-qi'>起</Label>
                      </View>
                    )}
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
            {/* <View className='more-tags'>
            {tags.map((item, index) => (
              <AtTag circle className='more-tag'  key={`tag-item-${index}`}>{item.title}</AtTag>
            ))} 
            </View>*/}
            {list.map(item => (
              <ProductItem
                onClick={this.handleProduct}
                key={`scene-item-${item.private_consume.id}`}
                type={
                  item.private_consume.scene === 'BANSHOU_PRIVATE'
                    ? 'gift'
                    : 'scene'
                }
                image={item.private_consume.images.split(',')[0]}
                title={item.private_consume.name}
                pointDesc={`${item.private_consume.evaluate_score ||
                  0}分 非常棒`}
                pointTail={`${item.private_consume.evaluate_count || 0}条点评`}
                subtitle={
                  (item.private_consume.recommend_count || 0) + '买过的推荐'
                }
                endTitle={item.private_consume.description || '未设置描述'}
                price={item.private_consume.price || '未定价'}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default More
