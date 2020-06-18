import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  ScrollView
} from '@tarojs/components'
import SysNavBar from '../../../components/SysNavBar'
import { connect } from '@tarojs/redux'
import { debounce } from 'debounce'
// import '../common/index.less'
import './index.scss'

import {
  AtDivider,
  AtNavBar,
  AtInputNumber,
  AtTabs,
  AtTabsPane,
  AtIcon,
  AtInput
} from 'taro-ui'
import QQMapWX from './qqmap'

let qqMapSDK = null

@connect(({ system }) => ({
  info: system.info
}))
class Location extends Component {
  config = {}

  state = {
    current: 0,
    currentCity: '厦门',
    keyword: '',
    title: '',
    suggestion: [],
    scrollTop: 0,
    toScrollView: false,
    nearby: [
      {
        title: '莲前西路/卧龙西路路口',
        address: '莲前西路/卧龙西路路口'
      },
      {
        title: '莲前西路/西林西三路路口',
        address: '莲前西路/西林西三路路口'
      },
      {
        title: '怡景花园西区-东门',
        address: '福建省厦门市思明区莲前西路232-234号'
      }
    ]
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

  componentDidMount() {
    qqMapSDK = new QQMapWX({
      key: 'JTKBZ-LCG6U-GYOVE-BJMJ5-E3DA5-HTFAJ' // 必填
    })

    qqMapSDK.search({
      keyword: '公交站  ',
      region: '厦门',
      success: res => {
        console.log(res)
      },
      fail: error => {
        console.log(error)
      },
      complete: res => {
        console.log(res)
        const nearby = []
        res.data.map(item => {
          nearby.push({
            title: item.title,
            address: item.address,
            longitude: item.location.lng,
            latitude: item.location.la
          })
        })
      }
    })

    const { windowWidth = 0 } = this.props.info
    Taro.createSelectorQuery()
      .select('#scrollView')
      .boundingClientRect(rect => {
        this.originTop = rect.top + 88 / (750 / windowWidth)
        console.log('originTop:', rect.top)
      })
      .exec()
  }

  handleSelectCity = e => {
    e.stopPropagation()
  }

  handleKeyword = value => {
    this.getSuggestion(value)
    this.setState({
      keyword: value
    })
  }

  getSuggestion = keyword => {
    const { currentCity } = this.state
    qqMapSDK.getSuggestion({
      keyword: keyword || '',
      region: currentCity,
      success: res => {
        const sug = []
        res.data.map(item => {
          sug.push({
            title: item.title,
            address: item.address,
            latitude: item.location.lat,
            longitude: item.location.lng
          })
        })
        this.setState({
          suggestion: sug
        })
      },
      fail: error => {
        console.log(error)
      },
      complete: res => {
        console.log('complete:', res)
      }
    })
  }

  handleClick = (value, e) => {
    e.stopPropagation()
    this.setState({
      current: value
    })
    let viewName = false
    switch (value) {
      case 0:
        viewName = 'nearby'
        break

      case 1:
        viewName = 'airport'
        break
      case 2:
        viewName = 'train_station'
        break

      default:
        break
    }
    this.setState({
      toScrollView: viewName
    })
  }

  setTabs(value) {
    const { current } = this.state
    if (value !== current) {
      this.setState({
        current: value
      })
    }
  }

  onScroll = e => {
    console.log('e: ', e.target.scrollTop)

    const { windowHeight = 0, windowWidth } = this.props.info
    if (!windowHeight) return
    const scrollViewTop = (174 + 88) / (750 / windowWidth)
    console.log('scrollHeight: ', scrollViewTop)

    Taro.createSelectorQuery()
      .select('#nearby')
      .boundingClientRect(nearby => {
        if (nearby.top - this.originTop < -700) {
          Taro.createSelectorQuery()
            .select('#airport')
            .boundingClientRect(airport => {
              if (airport.top - this.originTop < 700) {
                this.setTabs(2)
              } else {
                this.setTabs(1)
              }
            })
            .exec()
        } else {
          this.setTabs(0)
        }
      })
      .exec()
  }

  setValue(data) {
    console.log(this)
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.emit('acceptLocation', {...data})
    Taro.navigateBack()
  }

  render() {
    const {
      currentCity,
      title,
      keyword,
      suggestion,
      current,
      scrollTop,
      toScrollView,
      nearby
    } = this.state

    const airports = [
      {
        title: '高崎国际机场T3'
      },
      {
        title: '高崎国际机场T4'
      }
    ]

    const train_stations = [
      {
        title: '厦门站'
      },
      {
        title: '厦门北站'
      },
      {
        title: '厦门站高崎站'
      }
    ]

    const city = ['厦门', '泉州', '漳州']

    const tabList = [{ title: '周边' }, { title: '机场' }, { title: '火车站' }]

    const { windowHeight = 0, windowWidth } = this.props.info
    if (!windowHeight) return <View></View>
    const scrollStyle = {
      height: `${windowHeight * (750 / windowWidth) - 250 - 88}rpx`
    }

    const scrollStyle2 = {
      height: `${windowHeight * (750 / windowWidth) - 150 - 70}rpx`
    }

    return (
      <View className='location-page'>
        <SysNavBar title={title || '确认乘车地点'} />
        <View className='location-search-bar'>
          <View className='location-city' onClick={this.handleSelectCity}>
            {currentCity}
          </View>
          <View className='location-search-bar-split' />
          <AtIcon
            value='search'
            size='14'
            color='#767571'
            className='location-search-bar-icon'
          />
          <AtInput
            className='location-search-bar-input'
            placeholder='请输入地址'
            value={keyword}
            onFocus={this.showList}
            onBlur={this.hideList}
            onChange={debounce(this.handleKeyword, 250)}
          />
        </View>
        {keyword ? (
          <ScrollView scrollY scrollStyle={scrollStyle2}>
            {suggestion.map((item, index) => (
              <View
                className='suggestion-item'
                key={`suggestion-item-${index}`}
                onClick={() => {
                  this.setValue(item)
                }}
              >
                {index > 0 && <View className='split-line' />}
                <Label className='location-icon' />
                <Label className='location-title'>{item.title}</Label>
                <View className='location-address'>{item.address}</View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View>
            <AtTabs
              current={current}
              tabList={tabList}
              onClick={this.handleClick}
            />
            <ScrollView
              id='scrollView'
              className='location-scroll-view'
              scrollY
              scrollTop={scrollTop}
              onScroll={this.onScroll}
              style={scrollStyle}
              scrollIntoView={toScrollView}
            >
              <View id='nearby' className='split-title'>
                周边
              </View>
              {nearby.map((item, index) => (
                <View
                  className='suggestion-item'
                  key={`suggestion-item-${index}`}
                  onClick={() => {
                    this.setValue(item)
                  }}
                >
                  {index > 0 && <View className='split-line' />}
                  <Label className='location-icon' />
                  <Label className='location-title'>{item.title}</Label>
                  <View className='location-address'>{item.address}</View>
                </View>
              ))}
              <View id='airport' className='split-title'>
                机场
              </View>
              {airports.map((item, index) => (
                <View
                  className='airport-item'
                  key={`airport-item-${index}`}
                  onClick={() => {
                    this.setValue(item)
                  }}
                >
                  {index > 0 && <View className='split-line' />}
                  <Label className='airport-icon' />
                  <Label className='airport-title'>{item.title}</Label>
                </View>
              ))}
              <View id='train_station' className='split-title'>
                火车站
              </View>
              {train_stations.map((item, index) => (
                <View
                  className='train-item'
                  key={`train-item-${index}`}
                  onClick={() => {
                    this.setValue(item)
                  }}
                >
                  {index > 0 && <View className='split-line' />}
                  <Label className='train-icon' />
                  <Label className='train-title'>{item.title}</Label>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    )
  }
}

export default Location
