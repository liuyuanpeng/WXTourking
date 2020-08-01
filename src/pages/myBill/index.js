import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, ScrollView } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
// import '../../common/index.scss'
import './index.scss'

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
  }

  

  componentDidMount() {
    const current = this.$router.params.index || 0
    this.setState({
      current: parseInt(current)
    })
  }

  orders = [
    {
      id: '1',
      type: 'daySchedule',
      data: {
        status: 'done',
        start_place: '厦门',
        target_place: '漳州',
        day: 1,
        time: new Date().getTime(),
        car: {
          type: '舒适',
          sit: 5
        },
        price: 1793
      }
    },
    {
      id: '2',
      type: 'jiesongji',
      data: {
        status: 'wait_for_go',
        start_place: '厦门高崎国际机场T3',
        target_place: '厦门火车站',
        time: new Date().getTime(),
        car: {
          type: '舒适',
          sit: 7
        },
        price: 2135
      }
    },
    {
      id: '3',
      type: 'routeSchedule',
      data: {
        status: 'wait_for_go',
        day: 2,
        car: {
          type: '舒适',
          sit: 5
        },
        price: 688,
        template: {
          title: '厦门老院子景区两日游',
          image:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'
        }
      }
    },
    {
      id: '4',
      type: 'gift',
      data: {
        status: 'sending',
        count: 2,
        time: new Date().getTime(),
        price: 126,
        transport: 'LP00003688676142',
        template: {
          title: '苏小糖牛轧糖',
          image:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'
        }
      }
    },
    {
      id: '5',
      type: 'routeSchedule',
      data: {
        status: 'wait_for_pay',
        day: 2,
        time: new Date().getTime(),
        car: {
          type: '舒适',
          sit: 5
        },
        price: 688,
        template: {
          title: '厦门老院子景区两日游',
          image:
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'
        }
      }
    }
  ]

  onAllCheck = checked => {
    this.setState({
      allCheck: checked
    })
    if (checked) {
      let checks = []
      this.orders.map(item => {
        checks[item.id] = true
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

  onCheck = (id, checked) => {
    let newChecks = this.state.checks.concat()
    newChecks[id] = checked
    this.setState({
      checks: newChecks
    })
  }

  render() {
    const tabList = [{ title: '可开具发票' }, { title: '已开具发票' }]

    const { checks, allCheck } = this.state

    const scrollStyle = {
      height: `${Taro.$windowHeight -
        Taro.$statusBarHeight -
        88 -
        88 -
        140 -
        (checks.length ? 40 : 0)}rpx`
    }

    const scrollStyle2 = {
      height: `${Taro.$windowHeight -
        Taro.$statusBarHeight -
        88 - 88}rpx`
    }

    return (
      <View
        className='all-bill-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
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
                {this.orders.map((item, index) => {
                  return (
                    <BillItem
                      canCheck
                      checked={checks[item.id] || false}
                      onCheck={this.onCheck.bind(this, item.id)}
                      key={`bill-item-${index}`}
                      {...item}
                    />
                  )
                })}
              </ScrollView>
              {checks.length && (
                <View className='bill-tip'>
                  共选择
                  <Label className='bill-tip-yellow'>{checks.length}</Label>
                  个订单，<Label className='bill-tip-yellow'>{1793}</Label>元
                </View>
              )}
              <View className='bill-bottom'>
                <CheckBox
                  wrap-class='bill-all-check'
                  checked={allCheck}
                  onChange={this.onAllCheck}
                  title='本页全选'
                />
                <View className='bill-button-next' onClick={this.onNext}>
                  下一步
                </View>
              </View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle2}>
                {orders.map((item, index) => (
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
