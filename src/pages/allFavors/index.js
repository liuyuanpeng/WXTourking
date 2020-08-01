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

@connect(({  }) => ({
}))
class AllFavors extends Component {
  config = {
    navigationBarTitleText: '我的收藏'
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
  }

  componentDidMount() {}

  render() {
    const tabList = [
      { title: '景点' },
      { title: '美食' },
      { title: '视频' },
      {
        title: '攻略'
      }
    ]

    const favors = [
      {
        image:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
        title: '东方的圣托里尼，这里是离台 湾最近的秘境胜地',
        likes: 387,
        comments: 23
      },
      {
        image:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
        title: '东方的圣托里尼，这里是离台 湾最近的秘境胜地',
        likes: 387,
        comments: 23
      },
      {
        image:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
        title: '东方的圣托里尼，这里是离台 湾最近的秘境胜地',
        likes: 387,
        comments: 23
      },
      {
        image:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
        title: '东方的圣托里尼，这里是离台 湾最近的秘境胜地',
        likes: 387,
        comments: 23
      },
      {
        image:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
        title: '东方的圣托里尼，这里是离台 湾最近的秘境胜地',
        likes: 387,
        comments: 23
      },
      {
        image:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
        title: '东方的圣托里尼，这里是离台 湾最近的秘境胜地',
        likes: 387,
        comments: 23
      },
      {
        image:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
        title: '东方的圣托里尼，这里是离台 湾最近的秘境胜地',
        likes: 387,
        comments: 23
      }
    ]

    
    const scrollStyle = {
      height: `${Taro.$windowHeight - 85 - 88 - Taro.$statusBarHeight}rpx`
    }

    return (
      <View
        className='all-favor-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='我的收藏' />
        <View className='all-favor-tabs'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {favors.map((item, index) => (
                  <FavorItem key={`favor-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {favors.map((item, index) => (
                  <FavorItem key={`favor-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {favors.map((item, index) => (
                  <FavorItem key={`favor-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={3}>
              <ScrollView scrollY style={scrollStyle}>
                {favors.map((item, index) => (
                  <FavorItem key={`favor-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={4}>
              <ScrollView scrollY style={scrollStyle}>
                {favors.map((item, index) => (
                  <FavorItem key={`favor-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    )
  }
}

export default AllFavors
