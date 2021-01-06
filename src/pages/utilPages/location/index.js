import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  ScrollView
} from '@tarojs/components'
import SysNavBar from '@components/SysNavBar'
import { connect } from '@tarojs/redux'
import { debounce } from 'debounce'
// import '../../common/index.scss'
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

@connect(({ location, city }) => ({
  airports: location.airports,
  trains: location.trains,
  currentCity: city.current
}))
class Location extends Component {
  config = {}

  state = {
    current: 0,
    keyword: '',
    title: '',
    suggestion: [],
    scrollTop: 0,
    toScrollView: false,
    nearby: [
    ]
  }

  componentDidMount() {
    const { dispatch, currentCity } = this.props

    dispatch({
      type: 'location/getLocationList'
    })

    qqMapSDK = new QQMapWX({
      key: 'JTKBZ-LCG6U-GYOVE-BJMJ5-E3DA5-HTFAJ' // 必填
    })

    qqMapSDK.search({
      keyword: '酒店',
      region: currentCity.name,
      success: res => {
        const nearby = []
        res.data.map(item => {
          nearby.push({
            title: item.title,
            address: item.address,
            longitude: item.location.lng,
            latitude: item.location.lat
          })
        })
        this.setState({
          nearby
        })
      }
    })

    // Taro.createSelectorQuery()
    //   .select('#nearby')
    //   .boundingClientRect(rect => {
    //     this.originTop = rect.top
    //   })
    //   .exec()
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
    const { currentCity } = this.props
    qqMapSDK.getSuggestion({
      keyword: keyword || '',
      region: currentCity.name,
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
        viewName = 'airports'
        break
      case 2:
        viewName = 'trains'
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
    e.stopPropagation()
    Taro.createSelectorQuery()
      .select('#airports')
      .boundingClientRect(airport => {
        if (airport.top - this.originTop <= 0) {
          Taro.createSelectorQuery()
            .select('#trains')
            .boundingClientRect(train => {
              if (train.top - this.originTop <= 0) {
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
    const eventChannel = this.$scope.getOpenerEventChannel()
    if (data.id) {
      eventChannel.emit('acceptLocation', {
        title: data.name,
        address: data.detail,
        latitude: data.latitude,
        longitude: data.longitude
       })
    } else {
      eventChannel.emit('acceptLocation', { ...data })
    }
    Taro.navigateBack()
  }

  render() {
    const {
      title,
      keyword,
      suggestion,
      current,
      scrollTop,
      toScrollView,
      nearby
    } = this.state

    const { currentCity, airports, trains } = this.props

    const tabList = [{ title: '周边' }, { title: '机场' }, { title: '火车站' }]

    const scrollStyle = {
      height: `${Taro.$windowHeight -
        Taro.$statusBarHeight -
        88 -
        88 -
        70 -
        44}rpx`
    }

    const scrollStyle2 = {
      height: `${Taro.$windowHeight - Taro.$statusBarHeight - 88 - 70 - 44}rpx`
    }

    return (
      <View
        className='location-page'
        style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title={title || '确认乘车地点'} />
        <View className='location-search-bar'>
          <View className='location-city' onClick={this.handleSelectCity}>
            {currentCity.name}
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
          <ScrollView scrollY style={scrollStyle2}>
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
            <AtTabsPane current={this.state.current} index={0}>
              <ScrollView scrollY style={scrollStyle}>
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
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <ScrollView scrollY style={scrollStyle}>
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
                  <Label className='airport-title'>{item.name}</Label>
                </View>
              ))}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <ScrollView scrollY style={scrollStyle}>
              {trains.map((item, index) => (
                <View
                  className='train-item'
                  key={`train-item-${index}`}
                  onClick={() => {
                    this.setValue(item)
                  }}
                >
                  {index > 0 && <View className='split-line' />}
                  <Label className='train-icon' />
                  <Label className='train-title'>{item.name}</Label>
                </View>
              ))}
              </ScrollView>
            </AtTabsPane>
           </View>
        )}
      </View>
    )
  }
}

export default Location
