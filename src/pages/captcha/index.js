import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import SysNavBar from '../../components/SysNavBar'
import { AtInput } from 'taro-ui'
import CountDown from '@components/CountDown'

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
      phone: this.$router.params.phone || '',
      delta: parseInt(this.$router.params.delta || 3)
    })
  }

  handlePhoneChange = value => {
    this.setState({
      captcha: value
    })
    if (value && value.length === 6) {
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
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='登录' noBorder />
        <View className='login-title'>请填写手机短信验证码</View>
        <View className='login-subtitle'>已发送到手机号: {phone}</View>
        <AtInput
          className='phone-input'
          type='number'
          maxLength={6}
          value={captcha}
          onChange={this.handlePhoneChange}
          placeholder='请输入验证码'
        />
        <View className='captcha-tip'>
          <View className='captcha-tip-text'>6位数字验证码</View>
          {showCountDown ? (
            <CountDown
              wrap-class='captcha-tip-countdown'
              format='s'
              counts={60}
              onTimeUp={this.onTimeUp}
            />
          ) : (
            <View className='captcha-tip-resend' onClick={this.handleResend}>
              重新发送
            </View>
          )}
        </View>
        <View
          className={`login-next${nextEnable ? ' login-next-enable' : ''}`}
          onClick={nextEnable ? this.handleLogin : null}
        >
          登录
        </View>
      </View>
    )
  }
}

export default Captcha
