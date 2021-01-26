import Taro, { PureComponent } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, ScrollView, Button } from '@tarojs/components'
import {
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction
} from 'taro-ui'
import SysNavBar from '@components/SysNavBar'
import DiscoveryItem from '@components/DiscoveryItem'
import '../../common/index.scss'
import './index.scss'
import { debounce } from 'debounce'

const DISCOVERY_TYPES = {
  JINGDIAN: '景点',
  MEISHI: '美食',
  SHIPIN: '视频',
  GONGLUE: '攻略'
}

@connect(({ discovery }) => ({
  listJINGDIAN: discovery.listJINGDIAN,
  listMEISHI: discovery.listMEISHI,
  listSHIPIN: discovery.listSHIPIN,
  listGONGLUE: discovery.listGONGLUE
}))
class Discovery extends PureComponent {
  config = {
    navigationBarTitleText: '发现'
  }

  state = {
    current: 0,
    showModal: false,
    modalMsg: ''
  }

  componentDidShow() {
    if (
      Taro.getEnv() === Taro.ENV_TYPE.WEAPP &&
      typeof this.$scope.getTabBar === 'function' &&
      this.$scope.getTabBar()
    ) {
      this.$scope.getTabBar().$component.setState({
        selected: 1
      })
    }

    const { current } = this.state
    let scene
    switch (current) {
      case 0:
        scene = 'JINGDIAN'
        break
      case 1:
        scene = 'MEISHI'
        break
      case 2:
        scene = 'SHIPIN'
        break
      case 3:
        scene = 'GONGLUE'
        break
      default:
        break
    }
    this.props.dispatch({
      type: `discovery/getDiscoveryList`,
      payload: {
        faxian_category: scene
      },
      fail: msg => {
        Taro.showToast({
          title: msg || `获取${DISCOVERY_TYPES[scene]}列表失败`,
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
    let scene
    switch (value) {
      case 0:
        scene = 'JINGDIAN'
        break
      case 1:
        scene = 'MEISHI'
        break
      case 2:
        scene = 'SHIPIN'
        break
      case 3:
        scene = 'GONGLUE'
        break
      default:
        break
    }
    this.props.dispatch({
      type: `discovery/getDiscoveryList`,
      payload: {
        faxian_category: scene
      },
      fail: msg => {
        Taro.showToast({
          title: msg || `获取${DISCOVERY_TYPES[scene]}列表失败`,
          icon: 'none'
        })
      }
    })
  }

  handleAdd = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../publish/index'
    })
  }

  render() {
    const { listJINGDIAN, listMEISHI, listSHIPIN, listGONGLUE } = this.props

    const tabList = [
      { title: '景点' },
      { title: '美食' },
      { title: '视频' },
      { title: '攻略' }
    ]

    const scrollStyle = {
      height: `${Taro.$windowHeight - Taro.$statusBarHeight - 88 - 88 - 100}rpx`
    }

    const { current, showModal, modalMsg } = this.state

    return (
      <View
        className='discovery-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='发现' hideBack />
        <View className='discovery-tabs'>
          <AtTabs
            current={current}
            tabList={tabList}
            onClick={this.handleClick}
          >
            <AtTabsPane current={current} index={0}>
              <ScrollView
                className='discovery-scroll'
                scrollY
                style={scrollStyle}
              >
                <View className='discovery-scroll-items'>
                  {listJINGDIAN.map(item => (
                    <View
                      className='discovery-scroll-item'
                      key={`order-item-${item.id}`}
                    >
                      <DiscoveryItem
                        showModalMsg={this.showModalMsg}
                        data={item}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <ScrollView
                className='discovery-scroll'
                scrollY
                style={scrollStyle}
              >
                <View className='discovery-scroll-items'>
                  {listMEISHI.map(item => (
                    <View
                      className='discovery-scroll-item'
                      key={`order-item-${item.id}`}
                    >
                      <DiscoveryItem
                        showModalMsg={this.showModalMsg}
                        data={item}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={2}>
              <ScrollView
                className='discovery-scroll'
                scrollY
                style={scrollStyle}
              >
                <View className='discovery-scroll-items'>
                  {listSHIPIN.map(item => (
                    <View
                      className='discovery-scroll-item'
                      key={`order-item-${item.id}`}
                    >
                      <DiscoveryItem
                        showModalMsg={this.showModalMsg}
                        data={item}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={current} index={3}>
              <ScrollView
                className='discovery-scroll'
                scrollY
                style={scrollStyle}
              >
                <View className='discovery-scroll-items'>
                  {listGONGLUE.map(item => (
                    <View
                      className='discovery-scroll-item'
                      key={`order-item-${item.id}`}
                    >
                      <DiscoveryItem
                        showModalMsg={this.showModalMsg}
                        data={item}
                      />
                    </View>
                  ))}
                </View>
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
        <View className='discovery-add' onClick={debounce(this.handleAdd, 100)} />
      </View>
    )
  }
}

export default Discovery
