import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import SysNavBar from '@components/SysNavBar'
import { AtInput } from 'taro-ui'
import { debounce } from 'debounce'

@connect(({  }) => ({
}))
class Login extends Component {
  config = {
    navigationBarTitleText: '登录'
  }

  state = {
    phone: '',
    nextEnable: false,
    auto: false
  }

  componentWillMount() {}

  componentDidMount() {
    if (this.$router.params.auto) {
      this.setState({
        auto: true
      })
    }
  }

  handlePhoneChange = value => {
    this.setState({
      phone: value
    })
    if (value && value.length === 11) {
      this.setState({
        nextEnable: true
      })
    } else {
      this.setState({
        nextEnable: false
      })
    }
  }

  handleGetPhoneNumber = e => {
    e.stopPropagation()
    console.log(e)
  }

  handleNext = e => {
    e.stopPropagation()

    const { phone } = this.state

    const regex = /^(13|14|15|16|17|18|19)\d{9}$/
    if (!regex.test(phone)) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    } else {
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
            title: msg || '发送验证码失败，请稍后重试'
          })
        }
      })
    }
  }

  render() {
    const { phone, nextEnable, auto } = this.state
    return (
      <View className='login-manual' style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}>
        {/* <AtToast /> */}
        <SysNavBar title='登录' noBorder />
        <View className='login-title'>请输入手机号</View>
        <View className='login-subtitle'>
          为方便取的联系，请输入您常用的手机号码
        </View>
        {auto && (
          <Button
            className='login-title-btn'
            open-type='getPhoneNumber'
            onGetPhoneNumber={this.handleGetPhoneNumber}
          >
            一键获取手机号
          </Button>
        )}
        <AtInput
          className='phone-input'
          type='phone'
          value={phone}
          onChange={this.handlePhoneChange}
        />
        <View
          className={`login-next${nextEnable ? ' login-next-enable' : ''}`}
          onClick={nextEnable ? debounce(this.handleNext, 100) : null}
        >
          下一步
        </View>
      </View>
    )
  }
}

export default Login
