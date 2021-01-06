import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'
import { AtRate, AtIcon } from 'taro-ui'
import dayjs from 'dayjs'

class CommentItem extends Taro.Component {
  static defaultProps = {
    name: '',
    stars: 0,
    time: 0,
    comment: '',
    images: []
  }

  render() {
    const { name, stars, time, comment, images } = this.props
    return (
      <View className='comment-item'>
        <View className='time'>{dayjs(time).format('YYYY-MM-DD')}</View>
        <View className='avatar'>
          <AtIcon size={34} value='user' />
        </View>
        <View className='comment-header'>
          <View className='name'>{name}</View>
          {stars && <AtRate size={11} className='stars' value={stars} />}
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
