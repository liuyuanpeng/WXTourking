import Taro from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'
import dayjs from 'dayjs'

import './index.scss'

class FavorItem extends Taro.Component {
  static defaultProps = {
    image: null,
    title: '',
    likes: 0,
    comments: 0
  }

  render() {
    const { image, title, likes, comments } = this.props
    return (
      <View className='favor-item'>
        <Image className='favor-item-image' src={image} mode='aspectFill' />
        <View className='favor-detail'>
          <View className='favor-item-title'>{title}</View>
          <View className='favor-item-texts'>
            <View className='favor-icon-text'>
              <View className='favor-icon-favor' />
            </View>
            <View className='favor-icon-text'>
              <View className='favor-icon-comment' />
              {comments}
            </View>
            <View className='favor-icon-text'>
              <View className='favor-icon-like' />
              {likes}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
export default FavorItem
