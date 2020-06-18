import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  ScrollView
} from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
// import '../common/index.less'
import './index.scss'

import daySchedulePng from '../../asset/images/day_schedule.png'
import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane } from 'taro-ui'
import CommentItem from '../../components/CommentItem'
import SysNavBar from '../../components/SysNavBar'
import { returnFloat } from '../../utils/tool'
import ProfileItem from '../../components/ProfileItem'

@connect(({ system }) => ({
  info: system.info
}))
class Profile extends Component {
  config = {
    navigationBarTitleText: '我的资料'
  }


  componentWillMount() {
    if (this.props.info.windowHeight) return
    try {
      const res = Taro.getSystemInfoSync()
      const { dispatch } = this.props
      dispatch({
        type: 'system/updateSystemInfo',
        payload: res
      })
    } catch (e) {
      console.log('no system info')
    }
  }

  componentDidMount() {
  }

  render() {

    const profileList = [
      {
        title: '个人昵称',
        subtitle: 'aurevoir',
        action: () => {
          Taro.navigateTo({
            url: `../profileModify/index?key=nickname`
          })
        }
      },
      {
        title: '真实姓名',
        subtitle: 'aurevoir',
        action: () => {
          Taro.navigateTo({
            url: `../profileModify/index?key=name`
          })
        }
      },
      {
        title: '性别',
        subtitle: '男',
        hideRight: true,
        action: () => {

        }
      },
      {
        title: '常住地',
        subtitle: '',
        action: () => {
          Taro.navigateTo({
            url: `../profileModify/index?key=place`
          })
        }
      },
      {
        title: '个性签名',
        subtitle: '个性签名个性签名个性签名',
        action: () => {
          Taro.navigateTo({
            url: `../profileModify/index?key=signature`
          })
        }
      },
    ]

    return (
      <View className='profile-page'>
        <SysNavBar title='我的资料' />
        <View className='profile-header'>
          <View className='profile-header-title'>个人头像</View>
          <Image className='profile-header-image' mode='aspectFill' src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg' />
        </View>
        {profileList.map((item, index)=>(
          <ProfileItem key={`profile-item-${index}`} {...item} />
        ))}
      </View>
    )
  }
}

export default Profile
