import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image, Label } from '@tarojs/components'
import dayjs from 'dayjs'
import ORDER_STATUS from '@constants/status'
import ORDER_TYPE from '@constants/types'

import './index.scss'

import { connect } from 'react-redux'
import { AtIcon, AtToast } from 'taro-ui'
import { debounce } from 'debounce'
import { checkLogin } from '../../utils/tool'

@connect(({}) => ({}))
class DiscoveryItem extends React.Component {
  static defaultProps = {
    data: {},
    showModalMsg: null
  }

  showTransferNumber = (express_number, e) => {
    e.stopPropagation()
    const { showModalMsg } = this.props
    showModalMsg && showModalMsg(express_number)
  }

  gotoDetail = e => {
    e.stopPropagation()
    const { data } = this.props
    Taro.navigateTo({
      url: '../../pages/discoveryDetail/index',
      success: res => {
        res.eventChannel.emit('discoveryData', data)
      }
    })
  }

  render() {
    const { data } = this.props
    const {
      zan_count = 0,
      collect_count = 0,
      name = '',
      images = '',
      faxian_category = 'JINGDIAN',
      user = {}
    } = data

    let discoveryImage
    try {
      discoveryImage = images
        ? faxian_category === 'SHIPIN'
          ? images.split(',')[1]
          : images.split(',')[0]
        : ''
    } catch (error) {
      console.log(error)
    }
    return (
      <View className='discovery-item' onClick={debounce(this.gotoDetail, 100)}>
        <Image
          className='discovery-item-image'
          src={discoveryImage}
          mode='widthFix'
        />
        <View className='discovery-item-name'>{name}</View>
        {faxian_category === 'SHIPIN' && discoveryImage && (
          <View className='discovery-item-play' />
        )}
        <View className='discovery-item-footer'>
          <View className='discovery-item-footer-item'>
            <View className='discovery-item-footer-item-icon-avatar'>
              {user.avatar ? (
                <Image src={user.avatar} className='discovery-item-footer-item-icon-avatar-img' mode='aspectFill' />
              ) : (
                <AtIcon size={30} value='user' />
              )}
            </View>
            <View className='discovery-item-footer-item-text'>
              {user.nick_name || user.name || user.id}
            </View>
          </View>
          <View className='discovery-item-footer-item'>
            <View className='discovery-item-footer-item-icon-like' />
            <View className='discovery-item-footer-item-text'>{zan_count}</View>
          </View>
        </View>
      </View>
    )
  }
}
export default DiscoveryItem
