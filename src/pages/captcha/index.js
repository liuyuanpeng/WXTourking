import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { connect } from 'react-redux'
import './index.scss'
import styles from './index.module.scss'
import SysNavBar from '@components/SysNavBar'
import { AtInput } from 'taro-ui'
import CountDown from '@components/CountDown'
import { debounce } from 'debounce'
import STORAGE from '../../constants/storage'

@connect(({}) => ({}))
class Captcha extends Component {
  config = {
    navigationBarTitleText: '登录'
  }

  state = {
    captcha: '',
    phone: '',
    delta: 3,
    nextEnable: false,
    showCountDown: true
  }

  componentWillMount() {}

  componentDidMount() {
    this.setState({
      phone: Taro.getCurrentInstance().router.params.phone || '',
      delta: parseInt(Taro.getCurrentInstance().router.params.delta || 3)
    })
  }

  handlePhoneChange = value => {
    this.setState({
      captcha: value
    })
    if (value && value.length === 4) {
      this.setState({
        nextEnable: true
      })
    } else {
      this.setState({
        nextEnable: false
      })
    }
  }

  handleLogin = e => {
    e.stopPropagation()

    const { captcha, delta } = this.state

    this.props.dispatch({
      type: 'login/login',
      payload: {
        captcha
      },
      success: () => {
        // 获取用户信息
        this.props.dispatch({
          type: 'user/getUserInfo',
          success: user => {
            const avatarUrl = Taro.getStorageSync(STORAGE.WX_AVATAR)
            const nickName = Taro.getStorageSync(STORAGE.WX_NICKNAME)
            if (avatarUrl && nickName) {
              this.props.dispatch({
                type: 'user/updateUserInfo',
                payload: {
                  user_id: user.id,
                  avatar: avatarUrl,
                  nick_name: nickName
                }
              })
            }
          }
        })

        this.props.dispatch({
          type: 'city/getCityList'
        })

        this.props.dispatch({
          type: 'carTypes/getCarTypes'
        })

        this.props.dispatch({
          type: 'sit/getSitList'
        })
        Taro.navigateBack({
          delta
        })
      },
      fail: msg => {
        Taro.showToast({ title: msg || '登录失败', icon: 'none' })
      }
    })
  }

  onTimeUp = () => {
    this.setState({
      showCountDown: false
    })
  }

  handleResend = e => {
    e.stopPropagation()
    const { phone } = this.state
    this.props.dispatch({
      type: 'login/getCaptcha',
      payload: {
        username: phone
      },
      success: () => {
        this.setState({
          showCountDown: true
        })
      },
      fail: msg => {
        Taro.showToast({ title: msg || '发送失败，请稍后重试', icon: 'none' })
      }
    })
  }

  render() {
    const { captcha, nextEnable, showCountDown, phone } = this.state
    return (
      <View
        className='login-manual'
        style={{ top: 88 + window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='登录' noBorder />
        <View className='login-title'>请填写手机短信验证码</View>
        <View className='login-subtitle'>已发送到手机号: {phone}</View>
        <AtInput
          className='phone-input'
          type='number'
          maxLength={4}
          value={captcha}
          name='phone-input-captcha'
          onChange={this.handlePhoneChange}
          placeholder='请输入验证码'
        />
        <View className='captcha-tip'>
          <View className='captcha-tip-text'>4位数字验证码</View>
          {showCountDown ? (
            <CountDown
              wrapClass={styles.captchaTipCountdown}
              format='s'
              counts={60}
              onTimeUp={this.onTimeUp}
            />
          ) : (
            <View
              className='captcha-tip-resend'
              onClick={debounce(this.handleResend, 100)}
            >
              重新发送
            </View>
          )}
        </View>
        <View
          className={`login-next${nextEnable ? ' login-next-enable' : ''}`}
          onClick={nextEnable ? debounce(this.handleLogin, 100) : null}
        >
          登录
        </View>
      </View>
    )
  }
}

export default Captcha
