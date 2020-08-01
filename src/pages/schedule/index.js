import Taro, { PureComponent } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import SysNavBar from '@components/SysNavBar'
import OrderItem from '@components/OrderItem'
import '../../common/index.scss'
import './index.scss'

@connect(({ order }) => ({
  baocheOrders: order.baocheOrders,
  jiejiOrders: order.jiejiOrders,
  xianluOrders: order.xianluOrders
}))
class Home extends PureComponent {
  config = {
    navigationBarTitleText: '行程'
  }

  state = {
    current: 0
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'order/getBAOCHE',
      fail: msg => {
        Taro.showToast({
          title: msg || '获取行程失败',
          icon: 'none'
        })
      }
    })
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
    const { baocheOrders, jiejiOrders, xianluOrders } = this.props

    const tabList = [
      { title: '包车行程' },
      { title: '接机行程' },
      { title: '线路行程' }
    ]

    const scrollStyle = {
      height: `${Taro.$windowHeight - Taro.$statusBarHeight - 88 - 88 - 100}rpx`
    }

    return (
      <View
        className='schedule-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='行程' hideBack />
        <View className='schedule-tabs'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
                {baocheOrders.data_list.map(item => (
                  <OrderItem key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {jiejiOrders.data_list.map(item => (
                  <OrderItem key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {xianluOrders.data_list.map(item => (
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

export default Home
