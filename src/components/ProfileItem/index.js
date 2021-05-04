import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image } from '@tarojs/components'

import './index.scss'

class ProfileItem extends React.Component {
  static defaultProps = {
    title: '',
    subtitle: '',
    hideRight: false,
    action: null
  }

  handleClick = (subtitle, e) => {
    e.stopPropagation()
    const { action } = this.props
    action && action(subtitle)
  }

  render() {
    const { title, subtitle, hideRight } = this.props
    return (
      <View className='profile-list-item' onClick={this.handleClick.bind(this, subtitle)}>
        <View className='profile-list-item-title'>{title}</View>
        {subtitle && (
          <View className='profile-list-item-subtitle'>{subtitle}</View>
        )}
        {!hideRight && <View className='profile-list-item-right' />}
      </View>
    )
  }
}
export default ProfileItem
