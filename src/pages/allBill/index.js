import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  ScrollView
} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'

const safe_png = IMAGE_HOST + '/images/safe.png'

import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import STORAGE from '@constants/storage'
import dayjs from 'dayjs'

@connect(({ bill }) => ({
  data: bill.list
}))
class AllBill extends Component {
  config = {
    navigationBarTitleText: '全部发票'
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'bill/getBillPage',
      payload: {
        page: 0,
        size: 1000,
        user_id: Taro.getStorageSync(STORAGE.USER_ID)
      }
    })
  }

  render() {
    // const tagList = [
    //   {
    //     name: '服务热情',
    //     count: 31
    //   },
    //   {
    //     name: '车内干净',
    //     count: 31
    //   },
    //   {
    //     name: '服务周到',
    //     count: 31
    //   }
    // ]

    const { data = [] } = this.props

    const scrollStyle = {
      height: `${Taro.$windowHeight - Taro.$statusBarHeight - 88}rpx`
    }

    return (
      <View
        className='all-bill-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='全部发票' />
        <ScrollView scrollY scrollWithAnimation style={scrollStyle}>
          <View className='bills-container'>
            {data && data.map(bill => (
              <View key={bill.id} className='bill-item'>
                <View className='bill-item-title'>{bill.fapiao_name}</View>
                <View className='bill-item-status'>{bill.express_number?'已邮寄':'开票中'}</View>
                <View className='bill-item-price'>￥{bill.price}</View>
                <View className='bill-item-time'>{dayjs(bill.create_time).format('YYYY-MM-DD HH:mm:ss')}</View>
                <View className='bill-item-split' />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default AllBill
