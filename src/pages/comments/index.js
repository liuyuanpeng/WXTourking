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

const safe_png = IMAGE_HOST + '/images/safe.png'

import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'

@connect(({ city, evaluate }) => ({
  currentCity: city.current,
  comments: evaluate.list
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

  

  componentDidMount() {}

  render() {
    // const tagList = [
    //   {
    //     name: '服务热情',
    //     count: 31
    //   },
    //   {
    //     name: '车内干净',
    //     count: 31
    //   },
    //   {
    //     name: '服务周到',
    //     count: 31
    //   }
    // ]
    
    const {comments=[]} = this.props
    
    const scrollStyle = {
      height: `${Taro.$windowHeight - Taro.$statusBarHeight - 88}rpx`
    }

    return (
      <View className='comments-page' style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}>
        <SysNavBar title='全部评论' />
        {/* <View className='tags-container'>
          {tagList.map((item, index)=>(
            <View className='tag-item' key={`tag-item-${index}`}>
              {`${item.name}(${item.count})`}
            </View>
          ))}
        </View> */}
        <ScrollView scrollY scrollWithAnimation style={scrollStyle}>
          <View className='comments-container'>
          {comments.map((comment, index) => (
            <View key={`comment-item-${index}`}>
              {index > 0 && <View className='split-line' />}
              <CommentItem
                name={comment.username || comment.user_id}
                stars={comment.evaluate/2}
                time={comment.create_time}
                comment={comment.content}
                images={comment.image ? comment.image.split(',') : []}
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
