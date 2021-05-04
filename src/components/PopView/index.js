import Taro from '@tarojs/taro'
import React from 'react'
import { View } from '@tarojs/components'

import './index.scss'

class PopView extends React.Component {
  static defaultProps = {
    visible: false,
    title: '',
    onClose: null
  }

  onClose = e => {
    e.stopPropagation();
    const {onClose} = this.props
    onClose && onClose()
  }

  render() {
    const {visible, title} = this.props
    return (
      <View className={`pop-view${visible?' pop-view-active':''}`}>
        <View className='cover-view' onClick={this.onClose} />
        <View className='modal-view'>
          <View className='pop-title'>{title}</View>
          <View className='close-btn' onClick={this.onClose} />
          <View className='content-view'>{this.props.children}</View>
        </View>
      </View>
    )
  }
}
export default PopView
