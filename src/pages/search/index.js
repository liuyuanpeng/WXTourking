import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
// import '../common/index.scss'
import './index.scss'

import daySchedulePng from '../../asset/images/day_schedule.png'
import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane, AtTag } from 'taro-ui'
import CommentItem from '../../components/CommentItem'
import SysNavBar from '../../components/SysNavBar'
import {returnFloat} from '../../utils/tool'
import ProductItem from '../../components/ProductItem'

@connect(({ system }) => ({
  info: system.info
}))
class Search extends Component {
  config = {
  }

  state = {
    currentCity: '厦门'
  }

  handleSelectCity = value => {

    this.setState({
      currentCity: value
    })
  }
  render() {

    const {currentCity} = this.state

    const history = [
      '土楼', '厦门', '鼓浪屿'
    ]
    const hot = [
      '鼓浪屿', '福建天柱山欢乐大世界', '胡里山炮台', '厦门植物园', '厦门', '漳州',  '泉州'
    ]

    const city = [
      '厦门', '泉州', '漳州'
    ]

    return (
      <View className='search-page'>
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
        <View className='current-city' >{currentCity}</View>
        <View className='tag-title'>其他城市</View>
        {
          city.map((item, index) => (
            <AtTag onClick={this.handleSelectCity.bind(this, item)} type='primary' active={item === currentCity} className='tag-item' name={item} key={`city-tag-${index}`}>{item}</AtTag>
          ))
        }
      </View> 
    )
  }
}

export default Search
