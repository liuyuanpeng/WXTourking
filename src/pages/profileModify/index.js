import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from 'react-redux'
// import '../../common/index.scss'
import './index.scss'

import { AtInput } from 'taro-ui'
import SysNavBar from '@components/SysNavBar'

@connect(({ user }) => ({}))
class Profile extends Component {
  config = {
    navigationBarTitleText: '我的资料',
  }

  state = {
    title: '',
    value: '',
  }

  componentDidMount() {
    const key = Taro.getCurrentInstance().router.params.key || ''
    const value = Taro.getCurrentInstance().router.params.value || ''
    let title = '个人昵称'
    if (key === 'nickname') {
      title = '个人昵称'
    } else if (key === 'name') {
      title = '真实姓名'
    } else if (key === 'location') {
      title = '常住地'
    } else if (key === 'remark') {
      title = '个性签名'
    }

    this.setState({
      title,
      value,
    })
  }

  onOK = (e) => {
    e.stopPropagation()

    const key = Taro.getCurrentInstance().router.params.key || ''
    const payload = {}
    const { value, title } = this.state
    if (key === 'name') {
      payload.name = value
    } else if (key === 'location') {
      payload.location = value
    } else if (key === 'remark') {
      payload.remark = value
    }

    this.props.dispatch({
      type: 'user/updateUserInfo',
      payload,
      success: () => {
        Taro.navigateBack()
      },
      fail: (msg) => {
        Taro.showToast({ title: msg || `修改${title}失败`, icon: 'none' })
      },
    })
  }

  handleChange = (value) => {
    this.setState({
      value,
    })
  }

  render() {
    const { title, value } = this.state
    return (
      <View
        className='profile-modify-page'
        style={{ top: 88 + window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='我的资料' />
        <View className='profile-modifier'>
          <View className='profile-title'>{title}</View>
          <AtInput
            value={value}
            className='profile-input'
            name='profile-input-title'
            onChange={this.handleChange}
            placeholder={`请输入${title}`}
          />
        </View>
        <View className='profile-btn' onClick={this.onOK}>
          完成
        </View>
      </View>
    )
  }
}

export default Profile
