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
import FavorItem from '@components/FavorItem'
import STORAGE from '@constants/storage'


const DISCOVERY_TYPES = {
  JINGDIAN: '景点',
  MEISHI: '美食',
  SHIPIN: '视频',
  GONGLUE: '攻略'
}

@connect(({ discovery }) => ({
  listLikeJINGDIAN: discovery.listLikeJINGDIAN,
  listLikeMEISHI: discovery.listLikeMEISHI,
  listLikeSHIPIN: discovery.listLikeSHIPIN,
  listLikeGONGLUE: discovery.listLikeGONGLUE
}))
class AllLikes extends Component {
  config = {
    navigationBarTitleText: '我的点赞'
  }

  state = {
    current: 0
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
    this.getData(value)
  }

  getData = current => {
    let scene
    switch (current) {
      case 0:
        scene = 'JINGDIAN'
        break
      case 1:
        scene = 'MEISHI'
        break
      case 2:
        scene = 'SHIPIN'
        break
      case 3:
        scene = 'GONGLUE'
        break
      default:
        break
    }
    this.props.dispatch({
      type: `discovery/getDiscoveryLikeList`,
      payload: {
        faxian_category: scene,
        user_id: Taro.getStorageSync(STORAGE.USER_ID)
      },
      fail: msg => {
        Taro.showToast({
          title: msg || `获取${DISCOVERY_TYPES[scene]}收藏失败`,
          icon: 'none'
        })
      }
    })
  }

  componentDidShow() {
    const {current} = this.state
    this.getData(current)
  }

  render() {
    const tabList = [
      { title: '景点' },
      { title: '美食' },
      { title: '视频' },
      {
        title: '攻略'
      }
    ]

    const {listLikeJINGDIAN, listLikeMEISHI, listLikeSHIPIN, listLikeGONGLUE} = this.props
    
    const scrollStyle = {
      height: `${Taro.$windowHeight - 85 - 88 - Taro.$statusBarHeight}rpx`
    }

    return (
      <View
        className='all-like-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='我的点赞' />
        <View className='all-like-tabs'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {listLikeJINGDIAN.map((item, index) => (
                  <FavorItem key={`like-item-${index}`} {...item.find} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {listLikeMEISHI.map((item, index) => (
                  <FavorItem key={`like-item-${index}`} {...item.find} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {listLikeSHIPIN.map((item, index) => (
                  <FavorItem key={`like-item-${index}`} {...item.find} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={3}>
              <ScrollView scrollY style={scrollStyle}>
                {listLikeGONGLUE.map((item, index) => (
                  <FavorItem key={`like-item-${index}`} {...item.find} />
                ))}
              </ScrollView>
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    )
  }
}

export default AllLikes
