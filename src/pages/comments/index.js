import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  ScrollView
} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'

import safe_png from '../../asset/images/safe.png'

import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane } from 'taro-ui'
import CommentItem from '../../components/CommentItem'
import SysNavBar from '../../components/SysNavBar'

@connect(({ system }) => ({
  info: system.info
}))
class Comments extends Component {
  config = {
    navigationBarTitleText: '全部评论'
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

  componentDidMount() {}

  render() {
    const tagList = [
      {
        name: '服务热情',
        count: 31
      },
      {
        name: '车内干净',
        count: 31
      },
      {
        name: '服务周到',
        count: 31
      }
    ]

    const comments = [
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        images: [safe_png, safe_png, safe_png],
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      }
    ]

    const { windowHeight = 0, windowWidth} = this.props.info
    if (!windowHeight) return <View></View>
    const scrollStyle = {
      height: `${windowHeight*(750/windowWidth) - 240}rpx`
    }

    return (
      <View className='comments-page'>
        <SysNavBar title='全部评论' />
        <View className='tags-container'>
          {tagList.map((item, index)=>(
            <View className='tag-item' key={`tag-item-${index}`}>
              {`${item.name}(${item.count})`}
            </View>
          ))}
        </View>
        <ScrollView scrollY scrollWithAnimation style={scrollStyle}>
          <View className='comments-container'>
          {comments.map((comment, index) => (
            <View key={`comment-item-${index}`}>
              {index > 0 && <View className='split-line' />}
              <CommentItem
                avatar={comment.avatar}
                name={comment.user}
                stars={4.5}
                time={comment.time}
                comment={comment.comment}
                images={comment.images}
              />
            </View>
          ))}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Comments
