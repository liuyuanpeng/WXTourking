import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  ScrollView
} from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
// import '../common/index.scss'
import './index.scss'

import daySchedulePng from '../../asset/images/day_schedule.png'
import { AtDivider, AtNavBar, AtInputNumber, AtTabs, AtTabsPane } from 'taro-ui'
import CommentItem from '../../components/CommentItem'
import SysNavBar from '../../components/SysNavBar'
import { returnFloat } from '../../utils/tool'
import OrderItem from '../../components/OrderItem'

@connect(({  }) => ({
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
  }

  componentWillMount() {
  }

  componentDidMount() {
    const current = this.$router.params.index || 0
    console.log(current, this.$router)
    this.setState({
      current: parseInt(current)
    })
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

    const orders = [
      {
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
                {orders.map((item, index) => (
                  <OrderItem key={`order-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {orders.map((item, index) => (
                  <OrderItem key={`order-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {orders.map((item, index) => (
                  <OrderItem key={`order-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={3}>
              <ScrollView scrollY style={scrollStyle}>
                {orders.map((item, index) => (
                  <OrderItem key={`order-item-${index}`} {...item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={4}>
              <ScrollView scrollY style={scrollStyle}>
                {orders.map((item, index) => (
                  <OrderItem key={`order-item-${index}`} {...item} />
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
