import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, Label, Swiper, ScrollView } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from 'react-redux'
// import '../../common/index.scss'
import './index.scss'
import styles from './index.module.scss'

import {
  AtCheckbox,
  AtNavBar,
  AtInputNumber,
  AtTabs,
  AtTabsPane
} from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import BillItem from '@components/BillItem'
import CheckBox from '@components/CheckBox'
import { debounce } from 'debounce'

@connect(({ order }) => ({
  billOrders: order.billOrders,
  finishBillOrders: order.finishBillOrders
}))
class MyBill extends Component {
  config = {
    navigationBarTitleText: '我的发票'
  }

  state = {
    current: 0,
    checks: [],
    allCheck: false
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
    this.props.dispatch({
      type: `order/getBillOrders`,
      bill_type: value + 1,
      fail: msg => {
        Taro.showToast({
          title: msg || '获取订单失败',
          icon: 'none'
        })
      }
    })
  }

  componentDidMount() {
    const current = parseInt(Taro.getCurrentInstance().router.params.index || 0)
    this.setState({
      current
    })
    this.props.dispatch({
      type: `order/getBillOrders`,
      bill_type: current + 1,
      fail: msg => {
        Taro.showToast({
          title: msg || '获取订单失败',
          icon: 'none'
        })
      }
    })
  }

  onNext = e => {
    e.stopPropagation()
    const { checks } = this.state
    if (checks.length) {
      const price = this.getPrice()
      Taro.navigateTo({
        url: '../createBill/index',
        success: res => {
          res.eventChannel.emit('acceptBillData', {
            ids: checks.concat(),
            price
          })
        }
      })
    } else {
      Taro.showToast({
        title: '请选择订单',
        icon: 'none'
      })
    }
  }

  onAllCheck = checked => {
    this.setState({
      allCheck: checked
    })
    const { billOrders } = this.props
    if (checked) {
      let checks = []
      billOrders.data_list.map(item => {
        checks.push(item.order.id)
      })
      this.setState({
        checks
      })
    } else {
      this.setState({
        checks: []
      })
    }
  }

  getPrice() {
    let price = 0
    const { billOrders } = this.props
    const { checks } = this.state
    checks.forEach(id => {
      const bill = billOrders.data_list.find(item => item.order.id === id)
      if (bill) {
        price += bill.order.price
      }
    })
    return price
  }

  onCheck = (id, checked) => {
    let newChecks = this.state.checks.concat()
    const index = newChecks.indexOf(id)
    if (checked) {
      if (index === -1) {
        newChecks.push(id)
      }
    } else {
      newChecks.splice(index, 1)
    }

    this.setState({
      checks: newChecks
    })
  }

  render() {
    const tabList = [{ title: '可开具发票' }, { title: '已开具发票' }]

    const { checks, allCheck } = this.state

    const { billOrders, finishBillOrders } = this.props

    const scrollStyle = {
      height: `${window.$screenHeight -
        window.$statusBarHeight -
        88 -
        88 -
        140 -
        (checks.length ? 40 : 0)}rpx`
    }

    const scrollStyle2 = {
      height: `${window.$screenHeight - window.$statusBarHeight - 88 - 88}rpx`
    }

    return (
      <View
        className='all-bill-page'
        style={{ top: 88 + window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='我的发票' />
        <View className='all-bill-tabs'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {billOrders.data_list.map((item, index) => {
                  return (
                    <BillItem
                      canCheck
                      checked={checks.indexOf(item.order.id) !== -1}
                      onCheck={this.onCheck.bind(this, item.order.id)}
                      key={`bill-item-${index}`}
                      {...item}
                    />
                  )
                })}
              </ScrollView>
              {checks.length > 0 && (
                <View className='bill-tip'>
                  共选择
                  <Label className='bill-tip-yellow'>{checks.length}</Label>
                  个订单，
                  <Label className='bill-tip-yellow'>{this.getPrice()}</Label>元
                </View>
              )}
              <View className='bill-bottom'>
                <CheckBox
                  wrapClass={styles.billAllCheck}
                  checked={allCheck}
                  onChange={this.onAllCheck}
                  title='本页全选'
                />
                <View className='bill-button-next' onClick={debounce(this.onNext, 100)}>
                  下一步
                </View>
              </View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle2}>
                {finishBillOrders.data_list.map((item, index) => (
                  <BillItem key={`bill-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    )
  }
}

export default MyBill
