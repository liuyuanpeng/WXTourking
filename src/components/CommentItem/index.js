import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'
import { AtRate } from 'taro-ui'
import dayjs from 'dayjs'

class CommentItem extends Taro.Component {
  static defaultProps = {
    avatar: '',
    name: '',
    stars: 0,
    time: 0,
    comment: '',
    images: []
  }

  render() {
    const { avatar, name, stars, time, comment, images } = this.props
    return (
      <View className='comment-item'>
        <View className='time'>{dayjs(time).format('YYYY-MM-DD')}</View>
        <Image className='avatar' src={avatar} mode='aspectFill' />
        <View className='comment-header'>
          <View className='name'>{name}</View>
          <AtRate size={11} className='stars' value={stars} />
          
        </View>
        
        <View className='comment'>{comment}</View>
        <View className='images'>
          {images &&
            images.map((item, index) => (
              <Image
                className='image'
                key={`comment-image-${index}`}
                src={item}
                mode='aspectFill'
              />
            ))}
        </View>
        <View className='tail' />
      </View>
    )
  }
}
export default CommentItem
