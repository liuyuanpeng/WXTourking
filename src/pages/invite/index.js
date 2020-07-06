import Taro, { Component } from '@tarojs/taro'
import {
  View
} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import SysNavBar from '../../components/SysNavBar'


class AllOrders extends Component {
  config = {
    navigationBarTitleText: '邀请好友'
  }
  

  componentDidMount() {
  }

  render() {

    

    return (
      <View className='invite-page'>
        <SysNavBar transparent title='邀请好友' />
      </View>
    )
  }
}

export default AllOrders
