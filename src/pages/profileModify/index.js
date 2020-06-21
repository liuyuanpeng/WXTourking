import Taro, { Component } from '@tarojs/taro'
import {
  View
} from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
// import '../common/index.scss'
import './index.scss'

import {
  AtInput
} from 'taro-ui'
import SysNavBar from '../../components/SysNavBar'

@connect(({ system }) => ({
  info: system.info
}))
class Profile extends Component {
  config = {
    navigationBarTitleText: '我的资料'
  }

  state = {
    title: ''
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
    const key = this.$router.params.key || ''
    let title = '个人昵称'
    if (key === 'nickname') {
      title = '个人昵称'
    } else if (key === 'name') {
      title = '真实姓名'
    } else if (key === 'place') {
      title = '常住地'
    } else if (key === 'signature') {
      title = '个性签名'
    }

    this.setState({
      title
    })
  }

  onOK = e => {
    e.stopPropagation();
    Taro.navigateBack()
  }

  render() {
    const { title } = this.state
    return (
      <View className='profile-modify-page'>
        <SysNavBar title='我的资料' />
        <View className='profile-modifier'>
          <View className='profile-title'>{title}</View>
          <AtInput className='profile-input' placeholder={`请输入${title}`} />
          
        </View>
        <View className='profile-btn' onClick={this.onOK}>
            完成
          </View>
      </View>
    )
  }
}

export default Profile
