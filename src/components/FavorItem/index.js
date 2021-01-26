import Taro from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'
import dayjs from 'dayjs'

import './index.scss'
import { debounce } from 'debounce'

class FavorItem extends Taro.Component {
  gotoDetail = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../../pages/discoveryDetail/index',
      success: res => {
        res.eventChannel.emit('discoveryData', {...this.props})
      }
    })
  }

  render() {
    const { images, name, zan_count, evaluate_count, collect_count, faxian_category, find_zan_id, find_collect_id } = this.props
    let image
    if (faxian_category !== 'SHIPIN') {
      image = images ? images.split(',')[0] : ''
    } else {
      image = images ? images.split(',')[1] : ''
    }
    return (
      <View className='favor-item' onClick={debounce(this.gotoDetail, 100)}>
        <Image className='favor-item-image' src={image} mode='aspectFill' />
        <View className='favor-detail'>
          <View className='favor-item-title'>{name}</View>
          <View className='favor-item-texts'>
            <View className='favor-icon-text'>
              <View className='favor-icon-favor' />
            </View>
            <View className='favor-icon-text'>
              <View className='favor-icon-comment' />
              {evaluate_count}
            </View>
            <View className='favor-icon-text'>
              <View className='favor-icon-like' />
              {zan_count}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
export default FavorItem
