import Taro from '@tarojs/taro'
import React from 'react'
import { View } from '@tarojs/components'

import './index.scss'

class ModalView extends React.Component {
  static defaultProps = {
    visible: false,
    onClose: null
  }

  onClose = e => {
    e.stopPropagation();
    const {onClose} = this.props
    onClose && onClose()
  }

  render() {
    const {visible} = this.props
    return (
      <View className={`pop-view-ex${visible?' pop-view-ex-active':''}`}>
        <View className='cover-view' />
        <View className='modal-view'>
          <View className='close-btn' onClick={this.onClose} />
          <View className='content-view'>{this.props.children}</View>
        </View>
      </View>
    )
  }
}
export default ModalView
