import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import SysNavBar from '@components/SysNavBar'
import STORAGE from '@constants/storage'
import { debounce } from 'debounce'

@connect(({}) => ({}))
class Login extends Component {
  config = {
    navigationBarTitleText: '登录'
  }
  componentWillMount() {}

  componentDidMount() {
    Taro.login({
      success: res => {
        // 尝试获取/更新微信信息
        Taro.getUserInfo({
          lang: 'zh_CN',
          success: response => {
            const app = Taro.getApp()
            app.globalData.wxInfo = { ...response.userInfo }
          }
        })
        Taro.setStorageSync(STORAGE.USER_CODE, res.code)
        this.fetchSession()
      }
    })
  }

  fetchSession = () => {
    this.props.dispatch({
      type: 'user/getSession',
      success: () => {
        console.log('获取session成功')
      },
      refetch: () => {
        setTimeout(() => {
          this.fetchSession()
        }, 200)
      },
      fail: msg => {
        Taro.showToast({
          title: msg || '获取session失败，请稍后重试。',
          icon: 'none'
        })
      }
    })
  }

  handleWXLogin = e => {
    e.stopPropagation()
    if (!e.detail.encryptedData) {
      return
    }

    const { encryptedData, iv } = e.detail
    this.props.dispatch({
      type: 'user/getPhone',
      payload: {
        encrypted_data: encryptedData,
        iv
      },
      success: phone => {
        this.props.dispatch({
          type: 'login/getCaptcha',
          payload: {
            username: phone
          },
          success: () => {
            Taro.navigateTo({
              url: `../captcha/index?phone=${phone}`
            })
          },
          fail: msg => {
            Taro.showToast({
              title: msg || '发送验证码失败，请稍后重试',
              icon: 'none'
            })
          }
        })
      },
      fail: msg => {
        Taro.showToast({
          title: msg || '获取手机号码失败，请检查您的授权',
          icon: 'none'
        })
      }
    })
  }

  handleManual = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../manualLogin/index'
    })
  }

  render() {
    return (
      <View
        className='login-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='登录' noBorder />
        <View className='login-logo' />
        <Button
          lang='zh_CN'
          open-type='getPhoneNumber'
          className='login-btn'
          onGetPhoneNumber={this.handleWXLogin}
        >
          微信用户一键登录
        </Button>
        <View className='login-manual' onClick={debounce(this.handleManual, 100)}>
          输入手机号码登录/注册
        </View>
      </View>
    )
  }
}

export default Login
