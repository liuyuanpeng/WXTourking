import Taro from '@tarojs/taro'
import React from 'react'
import { View, Image } from '@tarojs/components'

import './index.scss'
import { debounce } from 'debounce'

class MineListItem extends React.Component {
  static defaultProps = {
    title: '',
    subtitle: '',
    icon: null,
    hideRight: false,
    onAction: null
  }

  handleClick = e => {
    e.stopPropagation();
    const {onAction} = this.props
    onAction && onAction()
  }

  render() {
    const {
      title,
      subtitle,
      icon,
      hideRight
    } = this.props
    return (
      <View className='mine-list-item' onClick={debounce(this.handleClick, 100)}>
        {!!icon && <Image className='mine-list-item-icon' src={icon} mode='widthFix' />}
    <View className='mine-list-item-title'>{title}</View>
    {!!subtitle && <View className='mine-list-item-subtitle'>{subtitle}</View>}
    {!hideRight && <View className='mine-list-item-right' />}
      </View>
    )
  }
}
export default MineListItem
