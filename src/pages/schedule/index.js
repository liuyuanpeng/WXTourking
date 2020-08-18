import Taro, { PureComponent } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
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
    current: 0,
    showModal: false,
    modalMsg: ''
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

    const {current, showModal, modalMsg} = this.state

    return (
      <View
        className='schedule-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
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
                  <OrderItem showModalMsg={this.showModalMsg} key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
                {jiejiOrders.data_list.map(item => (
                  <OrderItem showModalMsg={this.showModalMsg} key={`order-item-${item.order.id}`} data={item} />
                ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
                {xianluOrders.data_list.map(item => (
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

export default Home
