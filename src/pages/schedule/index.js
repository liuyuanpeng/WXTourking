import Taro, { PureComponent } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import SysNavBar from '../../components/SysNavBar'
import OrderItem from '../../components/OrderItem'
import '../common/index.less'
import './index.scss'

@connect(({ system }) => ({
  info: system.info
}))
class Home extends PureComponent {
  config = {
    navigationBarTitleText: '行程'
  }

  state = {
    current: 0
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

  componentDidShow() {
    if (
      Taro.getEnv() === Taro.ENV_TYPE.WEAPP &&
      typeof this.$scope.getTabBar === 'function' &&
      this.$scope.getTabBar()
    ) {
      this.$scope.getTabBar().$component.setState({
        selected: 2
      })
    }
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
  }

  render() {
    const tabList = [
      { title: '包车行程' },
      { title: '接机行程' },
      { title: '线路行程' }
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

    const { windowHeight = 0, windowWidth } = this.props.info
    if (!windowHeight) return <View></View>
    const scrollStyle = {
      height: `${windowHeight*(750/windowWidth) - 128 - 88 - 100}rpx`
    }

    return (
      <View className='schedule-page'>
        <SysNavBar title='行程' />
        <View className='schedule-tabs'>
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
          </AtTabs>
        </View>
      </View>
    )
  }
}

export default Home
