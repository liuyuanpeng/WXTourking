import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  ScrollView
} from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from 'react-redux'
// import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import ProfileItem from '@components/ProfileItem'
import TPickerView from '@components/TPickerView'
import STORAGE from '@constants/storage'

@connect(({ user }) => ({
  userInfo: user
}))
class Profile extends Component {
  config = {
    navigationBarTitleText: '我的资料'
  }

  state = {
    visible: false,
    active: [0]
  }

  componentDidMount() {}

  openModal = genderText => {
    this.setState({
      visible: true,
      active: [genderText === '女' ? 1 : 0]
    })
  }

  handleOK = current => {
    const gender = current.gender === '女' ? 'FEMALE' : 'MALE'
    this.props.dispatch({
      type: 'user/updateUserInfo',
      payload: {
        gender
      },
      success: () => {
        this.setState({
          visible: false,
          active: [current.gender === '女' ? 1 : 0]
        })
      },
      fail: msg => {
        Taro.showToast({ title: msg || '修改性别失败', icon: 'none' })
      }
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { visible, active } = this.state
    const avatarUrl = Taro.getStorageSync(STORAGE.WX_AVATAR)
    const nickName = Taro.getStorageSync(STORAGE.WX_NICKNAME)
    const wxGender = 0

    const { userInfo } = this.props
    const { name, gender, location, remark } = userInfo

    const genderText =
      gender === 'UNKNOWN'
        ? wxGender === 0
          ? '未知'
          : wxGender === 1
          ? '男'
          : '女'
        : gender === 'MALE'
        ? '男'
        : '女'

    const profileList = [
      {
        title: '个人昵称',
        subtitle: nickName,
        hideRight: true,
        action: () => {
          // 微信昵称不允许修改
          // Taro.navigateTo({
          //   url: `../profileModify/index?key=nickname`
          // })
        }
      },
      {
        title: '真实姓名',
        subtitle: name,
        action: subtitle => {
          Taro.navigateTo({
            url: `../profileModify/index?key=name&value=${subtitle}`
          })
        }
      },
      {
        title: '性别',
        subtitle: genderText,
        hideRight: true,
        action: () => {
          this.openModal(genderText)
        }
      },
      {
        title: '常住地',
        subtitle: location || '',
        action: subtitle => {
          Taro.navigateTo({
            url: `../profileModify/index?key=location&value=${subtitle}`
          })
        }
      },
      {
        title: '个性签名',
        subtitle: remark || '',
        action: subtitle => {
          Taro.navigateTo({
            url: `../profileModify/index?key=remark&value=${subtitle}`
          })
        }
      }
    ]

    return (
      <View
        className='profile-page'
        style={{ top: 88 + window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='我的资料' />
        <View className='profile-header'>
          <View className='profile-header-title'>个人头像</View>
          {!!avatarUrl && (
            <Image
              className='profile-header-image'
              mode='aspectFill'
              src={avatarUrl}
            />
          )}
        </View>
        {profileList.map((item, index) => (
          <ProfileItem key={`profile-item-${index}`} {...item} />
        ))}
        {visible && (
          <TPickerView
            onOK={this.handleOK}
            onCancel={this.handleCancel}
            title='请选择性别'
            lists={[{ key: 'gender', list: ['男', '女'] }]}
            active={active}
          />
        )}
      </View>
    )
  }
}

export default Profile
