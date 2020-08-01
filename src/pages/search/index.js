import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
// import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane, AtTag } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import {returnFloat} from '@utils/tool'
import ProductItem from '@components/ProductItem'


@connect(({city}) => ({
  cityList: city.list,
  currentCity: city.current
}))

class Search extends Component {
  config = {
  }

  handleSelectCity = value => {
    this.props.dispatch({
      type: 'city/updateCity',
      payload: {
        id: value
      }
    })

  }
  render() {

    const {cityList, currentCity} = this.props

    const history = [
      '土楼', '厦门', '鼓浪屿'
    ]
    const hot = [
      '鼓浪屿', '福建天柱山欢乐大世界', '胡里山炮台', '厦门植物园', '厦门', '漳州',  '泉州'
    ]

    return (
      <View className='search-page' style={{top: `${Taro.$statusBarHeight + 184}rpx`}}>
        <NavBar opacity={1} title='搜索' showBack />
        <View className='tag-title'>历史搜索</View>
        {
          history.map((item, index)=>(
          <AtTag className='tag-item' key={`history-tag-${index}`} type='primary' name={item}>{item}</AtTag>
          ))
        }
        <View className='tag-title'>热门搜索</View>
        {
          hot.map((item, index)=>(
          <AtTag className='tag-item' key={`history-tag-${index}`} type='primary' name={item}>{item}</AtTag>
          ))
        }
        <View className='search-split' />
        <View className='tag-title'>当前城市</View>
        <View className='current-city' >{currentCity.name}</View>
        <View className='tag-title'>其他城市</View>
        {
          cityList.map((item, index) => (
            <AtTag onClick={this.handleSelectCity.bind(this, item.id)} type='primary' active={item === currentCity} className='tag-item' name={item.id} key={`city-tag-${index}`}>{item.name}</AtTag>
          ))
        }
      </View> 
    )
  }
}

export default Search
