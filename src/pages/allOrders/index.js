import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Button,
  ScrollView
} from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import '../../common/index.scss'
import './index.scss'

import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtTabs, AtTabsPane } from 'taro-ui'
import SysNavBar from '@components/SysNavBar'
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
    current: 0,
    showModal: false,
    modalMsg: ''
  }

  showModalMsg = (modalMsg) => {
    this.setState({
      showModal: true,
      modalMsg
    })
  }

  closeModal = () => {
    this.setState({
      showModal: false,
      modalMsg: ''
    })
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

    const {current, showModal, modalMsg} = this.state
    return (
      <View
        className='all-order-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='全部订单' />
        <View className='all-order-tabs'>
          <AtTabs
            current={current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {allOrders.data_list.map(item => (
                  <OrderItem showModalMsg={this.showModalMsg} key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {waitForPayOrders.data_list.map(item => (
                  <OrderItem showModalMsg={this.showModalMsg} key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {waitForGoOrders.data_list.map(item => (
                  <OrderItem showModalMsg={this.showModalMsg} key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={3}>
              <ScrollView scrollY style={scrollStyle}>
                {finishOrders.data_list.map(item => (
                  <OrderItem showModalMsg={this.showModalMsg} key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={4}>
              <ScrollView scrollY style={scrollStyle}>
                {waitForCommentOrders.data_list.map(item => (
                  <OrderItem showModalMsg={this.showModalMsg} key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
          </AtTabs>
        </View>
        <AtModal isOpened={showModal}>
          <AtModalHeader>物流编号</AtModalHeader>
          <AtModalContent>{modalMsg}</AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeModal}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default AllOrders
