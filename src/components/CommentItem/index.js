import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image } from '@tarojs/components'

import './index.scss'
import { AtRate, AtIcon } from 'taro-ui'
import dayjs from 'dayjs'

class CommentItem extends React.Component {
  static defaultProps = {
    name: '',
    stars: 0,
    time: 0,
    comment: '',
    images: [],
    avatar: ''
  }

  render() {
    const { name, stars, time, comment, images, avatar } = this.props
    return (
      <View className='comment-item'>
        <View className='time'>{dayjs(time).format('YYYY-MM-DD')}</View>
        <View className='avatar'>
          {avatar ? (
            <Image src={avatar} className='avatar-img' mode='scaleToFill' />
          ) : (
            <AtIcon size={34} value='user' />
          )}
        </View>
        <View className='comment-header'>
          <View className='name'>{name}</View>
          {stars ? <AtRate size={11} className='stars' value={stars} /> : null}
        </View>

        <View className='comment'>{comment}</View>
        <View className='images'>
          {images ?
            images.map((item, index) => (
              <Image
                className='image'
                key={`comment-image-${index}`}
                src={item}
                mode='aspectFill'
              />
            )) : null}
        </View>
        <View className='tail' />
      </View>
    )
  }
}
export default CommentItem
