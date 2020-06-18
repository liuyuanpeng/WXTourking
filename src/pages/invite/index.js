import Taro, { Component } from '@tarojs/taro'
import {
  View
} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import SysNavBar from '../../components/SysNavBar'

@connect(({ system }) => ({
  info: system.info
}))
class AllOrders extends Component {
  config = {
    navigationBarTitleText: '邀请好友'
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

    const { windowHeight = 0 } = this.props.info
    if (!windowHeight) return <View></View>

    return (
      <View className='invite-page'>
        <SysNavBar transparent title='邀请好友' />
      </View>
    )
  }
}

export default AllOrders
