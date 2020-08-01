import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  ScrollView
} from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
// import '../../asset/common/index.scss'
import './index.scss'

import daySchedulePng from '@images/day_schedule.png'
import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import OrderItem from '@components/OrderItem'

@connect(({ order }) => ({
  allOrders: order.allOrders,
  waitForPayOrders: order.waitForPayOrders,
  waitForGoOrders: order.waitForGoOrders,
  finishOrders: order.finishOrders,
  waitForCommentOrders: order.waitForCommentOrders
}))
class AllOrders extends Component {
  config = {
    navigationBarTitleText: '全部订单'
  }

  state = {
    current: 0
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
    this.getData(value)
  }

  getData(INDEX, force=false) {
    console.log('force:', force)
    const {current} = this.state
    if (INDEX === current && !force) return
    let dispatchType = ''
    switch (parseInt(INDEX)) {
      case 0:
        dispatchType = 'getAllOrders'
        break
      case 1:
        dispatchType = 'getWaitForPay'
        break
      case 2:
        dispatchType = 'getWaitForGo'
        break
      case 3:
        dispatchType = 'getFinish'
        break
      case 4:
        dispatchType = 'getWaitForComment'
        break
      default:
        break
    }

    if (dispatchType) {
      this.props.dispatch({
        type: `order/${dispatchType}`,
        fail: msg => {
          Taro.showToast({
            title: msg || '获取订单失败',
            icon: 'none'
          })
        }
      })
    }
  }

  componentWillMount() {}

  componentDidMount() {
    const current = this.$router.params.index || 0
    this.setState({
      current: parseInt(current)
    })
    this.getData(current, true)
  }

  render() {
    const tabList = [
      { title: '全部' },
      { title: '待付款' },
      { title: '待出行' },
      {
        title: '已完成'
      },
      {
        title: '待评价'
      }
    ]

    const {
      allOrders,
      waitForPayOrders,
      waitForGoOrders,
      finishOrders,
      waitForCommentOrders
    } = this.props

    const scrollStyle = {
      height: `${Taro.$windowHeight - 85 - 88 - Taro.$statusBarHeight}rpx`
    }

    return (
      <View
        className='all-order-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='全部订单' />
        <View className='all-order-tabs'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {allOrders.data_list.map(item => (
                  <OrderItem key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {waitForPayOrders.data_list.map(item => (
                  <OrderItem key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {waitForGoOrders.data_list.map(item => (
                  <OrderItem key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={3}>
              <ScrollView scrollY style={scrollStyle}>
                {finishOrders.data_list.map(item => (
                  <OrderItem key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={4}>
              <ScrollView scrollY style={scrollStyle}>
                {waitForCommentOrders.data_list.map(item => (
                  <OrderItem key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    )
  }
}

export default AllOrders
