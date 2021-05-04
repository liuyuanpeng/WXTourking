import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Button } from '@tarojs/components'
import {
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction
} from 'taro-ui'
import '../../common/index.scss'
import './index.scss'
import SysNavBar from '@components/SysNavBar'
import OrderItem from '@components/OrderItem'
import { isLogin } from '../../utils/tool'
import STORAGE from '../../constants/storage'

@connect(({ order }) => ({
  baocheOrders: order.baocheOrders,
  jiejiOrders: order.jiejiOrders,
  xianluOrders: order.xianluOrders,
  payOrders: order.payOrders
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '行程'
  }

  state = {
    current: 0,
    showModal: false,
    modalMsg: ''
  }

  componentDidShow() {
    if (!isLogin()) {
      return
    }

    let current = Taro.getStorageSync(STORAGE.SWITCH_INDEX)
    current >= 0 && this.setState({
      current
    })
    current = this.state.current || 0
    Taro.setStorageSync(STORAGE.SWITCH_INDEX, 0)
    let scene
    switch (current) {
      case 0:
        scene = 'BAOCHE'
        break
      case 1:
        scene = 'JIEJI'
        break
      case 2:
        scene = 'XIANLU'
        break
      case 3:
        scene = 'PAY'
      default:
        break
    }
    this.props.dispatch({
      type: `order/get${scene}`,
      fail: msg => {
        Taro.showToast({
          title: msg || '获取行程失败',
          icon: 'none'
        })
      }
    })
  }

  showModalMsg = modalMsg => {
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

    if (!isLogin()) {
      return
    }

    let scene
    switch (value) {
      case 0:
        scene = 'BAOCHE'
        break
      case 1:
        scene = 'JIEJI'
        break
      case 2:
        scene = 'XIANLU'
        break
      case 3:
        scene = 'PAY'
      default:
        break
    }
    this.props.dispatch({
      type: `order/get${scene}`,
      fail: msg => {
        Taro.showToast({
          title: msg || '获取行程失败',
          icon: 'none'
        })
      }
    })
  }

  render() {
    const { baocheOrders, jiejiOrders, xianluOrders, payOrders } = this.props

    const tabList = [
      { title: '包车行程' },
      { title: '接机行程' },
      { title: '线路行程' },
      {
        title: '结算行程'
      }
    ]

    const scrollStyle = {
      height: `${window.$windowHeight - window.$statusBarHeight - 88 - 88}rpx`
    }

    const { current, showModal, modalMsg } = this.state

    return (
      <View
        className='schedule-page'
        style={{ top: 88 + window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='行程' hideBack />
        <View className='schedule-tabs'>
          <AtTabs
            current={current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {baocheOrders.data_list.map(item => (
                  <OrderItem
                    showModalMsg={this.showModalMsg}
                    key={`order-item-${item.order.id}`}
                    data={item}
                  />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {jiejiOrders.data_list.map(item => (
                  <OrderItem
                    showModalMsg={this.showModalMsg}
                    key={`order-item-${item.order.id}`}
                    data={item}
                  />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {xianluOrders.data_list.map(item => (
                  <OrderItem
                    showModalMsg={this.showModalMsg}
                    key={`order-item-${item.order.id}`}
                    data={item}
                  />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={3}>
              <ScrollView scrollY style={scrollStyle}>
                {payOrders.map(item => (
                  <OrderItem
                    showModalMsg={this.showModalMsg}
                    key={`order-item-${item.order.id}`}
                    data={item}
                  />
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

export default Home
