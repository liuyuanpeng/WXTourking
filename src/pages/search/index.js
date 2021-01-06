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

import {
  AtDivider,
  AtNavBar,
  AtInputNumber,
  AtTabs,
  AtTabsPane,
  AtTag
} from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import ProductItem from '@components/ProductItem'
import STORAGE from '../../constants/storage'
import search from '../../models/search'

@connect(({ city, search }) => ({
  cityList: city.list,
  currentCity: city.current,
  hotSearch: search.hotSearch,
  result: search.list
}))
class Search extends Component {
  config = {}

  componentDidMount() {
    this.props.dispatch({
      type: 'search/getHotSearchList'
    })
  }

  handleSelectCity = value => {
    this.props.dispatch({
      type: 'city/updateCity',
      payload: {
        id: value
      }
    })
  }

  onSearch(value) {
    this.props.dispatch({
      type: 'search/getSearchResult',
      value,
      success: result => {
        if (!result || result.length === 0) {
          Taro.showToast({
            title: '找不到关联项目',
            icon: 'none'
          })
        }
      },
      fail: msg => {
        Taro.showToast({
          title: msg || '搜索错误',
          icon: 'error'
        })
      }
    })
  }

  handleProduct = (detail, e)=> {
    e.stopPropagation()
    const {private_consume} = detail
    const {scene} = private_consume
    if (scene === 'ROAD_PRIVATE') {
      Taro.navigateTo({
        url: '../routeDetail/index',
        success: res => {
          res.eventChannel.emit('roadData', {
            ...detail
          })
        }
      })
    } else {
      Taro.navigateTo({
        url: `../product/index`,
        success: res => {
          res.eventChannel.emit('acceptProductData', {
            ...detail
          })
        }
      })
    }
  }

  render() {
    const { cityList, currentCity, hotSearch, result } = this.props

    const history = Taro.getStorageSync(STORAGE.HISTORY)
    const histories = history && history.length ? history.split(',') : []
    return (
      <View
        className='search-page'
        style={{ top: `${Taro.$statusBarHeight + 184}rpx` }}
      >
        <NavBar opacity={1} title='搜索' showBack />
        {result && result.length && (
          <View className='search-result' style={{height: (Taro.$windowHeight - Taro.$statusBarHeight - 204) + 'px'}}>
            {result.map((item) => (
              <ProductItem
                onClick={this.handleProduct.bind(this, item)}
                key={`scene-item-${item.private_consume.id}`}
                type={
                  item.private_consume.scene === 'BANSHOU_PRIVATE'
                    ? 'gift'
                    : 'scene'
                }
                image={item.private_consume.images.split(',')[0]}
                title={item.private_consume.name}
                pointDesc={`${item.private_consume.evaluate_score ||
                  0}分 ${item.private_consume.evaluate_score>=7?'非常棒': ''}`}
                pointTail={`${item.private_consume.evaluate_count || 0}条点评`}
                // subtitle={
                //   (item.private_consume.recommend_count || 0) + '买过的推荐'
                // }
                endTitle={item.private_consume.description || '未设置描述'}
                price={item.private_consume.price || '未定价'}
              />
            ))}
          </View>
        )}
        {histories.length && <View className='tag-title'>历史搜索</View>}
        {histories.map((item, index) => (
          <AtTag
            onClick={this.onSearch.bind(this, item)}
            className='tag-item'
            key={`history-tag-${index}`}
            type='primary'
            name={item}
          >
            {item}
          </AtTag>
        ))}
        <View className='tag-title'>热门搜索</View>
        {hotSearch.map((item, index) => (
          <AtTag
            onClick={this.onSearch.bind(this, item.name)}
            className='tag-item'
            key={`history-tag-${index}`}
            type='primary'
            name={item.name}
          >
            {item.name}
          </AtTag>
        ))}
        <View className='search-split' />
        <View className='tag-title'>当前城市</View>
        <View className='current-city'>{currentCity.name}</View>
        <View className='tag-title'>其他城市</View>
        {cityList.map((item, index) => (
          <AtTag
            onClick={this.handleSelectCity.bind(this, item.id)}
            type='primary'
            active={item === currentCity}
            className='tag-item'
            name={item.id}
            key={`city-tag-${index}`}
          >
            {item.name}
          </AtTag>
        ))}
      </View>
    )
  }
}

export default Search
