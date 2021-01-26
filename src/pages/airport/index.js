import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import '../../common/index.scss'
import './index.scss'

const service_assurance_png = IMAGE_HOST + '/images/service_assurance.png'
const precious_png = IMAGE_HOST + '/images/precious.png'
const free_waiting_png = IMAGE_HOST + '/images/free_waiting.png'
const safe_png = IMAGE_HOST + '/images/safe.png'

import { AtInput } from 'taro-ui'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import SwitchButton from '@components/SwitchButton'
import dayjs from 'dayjs'
import LocationInput from '@components/LocationInput'
import DateTimePicker from '@components/DateTimePicker'
import CheckBox from '@components/CheckBox'

import QQMapWX from '../utilPages/location/qqmap'
import { debounce } from 'debounce'

let qqMapSDK = null

@connect(({ city }) => ({
  currentCity: city.current
}))
class JSJPage extends Component {
  config = {
    navigationBarTitleText: '接送机'
  }

  state = {
    isSJ: false,
    start_place: { title: '' },
    target_place: { title: '' },
    start_time: dayjs().add(5, 'm'),
    fly: '',
    backCheck: false,
    start_place_back: { title: '' },
    target_place_back: { title: '' },
    start_time_back: dayjs().add(5, 'm')
  }

  handleTypeChange = value => {
    this.setState({
      isSJ: value
    })
  }

  componentWillMount() {}

  componentDidMount() {}

  handleStartPlace = location => {
    this.setState({
      start_place: location
    })
    const { target_place } = this.state
    if (
      location.latitude &&
      location.longitude &&
      target_place.latitude &&
      target_place.longitude
    ) {
      this.getDistance({
        from: location.latitude + ',' + location.longitude,
        to: target_place.latitude + ',' + target_place.longitude
      })
    }
  }

  handleTargetPlace = location => {
    this.setState({
      target_place: location
    })
    const {start_place} = this.state
    if (
      location.latitude &&
      location.longitude &&
      start_place.latitude &&
      start_place.longitude
    ) {
      this.getDistance({
        from: start_place.latitude + ',' + start_place.longitude,
        to: location.latitude + ',' + location.longitude
      })
    }
  }

  handleStartPlaceBack = location => {
    this.setState({
      start_place_back: location
    })
  }

  handleTargetPlaceBack = location => {
    this.setState({
      target_place_back: location
    })
  }

  handleStartTime = time => {
    this.setState({
      start_time: time
    })
  }

  handleStartTimeBack = time => {
    this.setState({
      start_time_back: time
    })
  }

  handleFlyChange = value => {
    this.setState({
      fly: value
    })
  }

  handleBackCheck = bCheck => {
    this.setState({
      backCheck: bCheck
    })
  }

  handleOrder = e => {
    e.stopPropagation()
  }

  getDistance = params => {
    qqMapSDK = new QQMapWX({
      key: 'JTKBZ-LCG6U-GYOVE-BJMJ5-E3DA5-HTFAJ' // 必填
    })
    const { from, to } = params
    qqMapSDK.calculateDistance({
      mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      from, //若起点有数据则采用起点坐标，若为空默认当前地址
      to, //终点坐标
      success: (res) => {
        //成功后的回调

        if (res.status == 0 && res.result.elements.length > 0) {
          this.distance = res.result.elements[0].distance
          this.duration = res.result.elements[0].duration
        }
      },
      fail: function(error) {
        console.error(error)
      }
    })
  }

  handleOK = e => {
    e.stopPropagation()
    const {
      backCheck,
      isSJ,
      start_place,
      target_place,
      start_place_back,
      target_place_back,
      start_time,
      start_time_back,
      fly
    } = this.state
    let msg
    if (!start_place.title) {
      msg = isSJ ? '请输入上车地点' : '请输入机场/火车站'
    } else if (!target_place.title) {
      msg = '请输入送达地点'
    } else if (start_time.isBefore(dayjs())) {
      msg = '请选择正确的上车时间'
    } else if (!isSJ && backCheck) {
      if (!start_place_back.title) {
        msg = '请输入返程机场/火车站'
      } else if (!target_place_back.title) {
        msg = '请输入返程送达地点'
      } else if (start_time_back.isBefore(start_time)) {
        msg = '请输入正确的返程时间'
      }
    }
    if (msg) {
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }

    const { dispatch, currentCity } = this.props
    dispatch({
      type: 'consume/getConsumeList',
      payload: {
        params: {
          scene: isSJ ? 'SONGJI' : 'JIEJI',
          city_id: currentCity.id
        }
      },
      success: () => {
        Taro.navigateTo({
          url: '../carType/index',
          success: res => {
            res.eventChannel.emit('acceptData', {
              start_place,
              target_place,
              start_time,
              fly: isSJ ? '' : fly,
              scene: isSJ ? 'SONGJI' : 'JIEJI',
              kilo: this.distance,
              time: this.duration
            })
          }
        })
      },
      fail: () => {
        Taro.showToast({
          title: '获取用车服务失败',
          icon: 'none'
        })
      }
    })
  }

  render() {
    const {
      isSJ,
      start_place,
      target_place,
      start_time,
      fly,
      start_place_back,
      target_place_back,
      start_time_back,
      backCheck
    } = this.state
    const ensures = [
      {
        icon: service_assurance_png,
        title: '服务保障',
        subtitle: '7x24小时客服贴心服务'
      },
      { icon: precious_png, title: '价格优选', subtitle: '一口模式拒绝绕路' },
      { icon: free_waiting_png, title: '免费等待', subtitle: '免费等待60分钟' },
      { icon: safe_png, title: '出行安心', subtitle: '百万保险&爽约包赔' }
    ]

    const scrollStyle = {
      height: `${Taro.$windowHeight - 434}rpx`
    }

    return (
      <View className='JSJ-page'>
        <SysNavBar title='' transparent />
        <View className='JSJ-page-bkg' />
        <View className='JSJ-page-container'>
          <SwitchButton
            wrap-class='switch-btn'
            isRight={isSJ}
            onChange={this.handleTypeChange}
          />
          <ScrollView
            className='scroll-view'
            scrollY
            style={scrollStyle}
            scrollWithAnimation
          >
            <View className='JSJ-content'>
              <View className='JSJ-content-item'>
                <View className='JSJ-content-item-label'>
                  {isSJ ? '上车地点' : '机场/火车站'}
                </View>
                <LocationInput
                  wrap-class='JSJ-content-item-value'
                  title={start_place.title}
                  onChange={this.handleStartPlace}
                  placeholder='请选择上车地点'
                />
              </View>
              <View className='JSJ-content-item'>
                <View className='JSJ-content-item-label'>送达地点</View>
                <LocationInput
                  wrap-class='JSJ-content-item-value'
                  title={target_place.title}
                  onChange={this.handleTargetPlace}
                  placeholder='请选择下车地点'
                />
              </View>
              <View className='JSJ-content-item'>
                <View className='JSJ-content-item-label'>用车时间</View>
                <DateTimePicker
                  wrap-class='JSJ-content-item-value'
                  selected-item-day-extern='JSJ-content-item-time-day'
                  selected-item-week-extern='JSJ-content-item-week-day'
                  onOk={this.handleStartTime}
                  initValue={start_time}
                  hidePassed
                  placeholder='请输入用车时间'
                />
              </View>
              {!isSJ && (
                <View>
                  <View className='JSJ-content-item'>
                    <View className='JSJ-content-item-label'>航班号/班次</View>
                    <AtInput
                      className='JSJ-content-item-value'
                      onChange={this.handleFlyChange}
                      value={fly}
                      placeholder='请填写航班号'
                    />
                  </View>
                  {/* <CheckBox
                    wrap-class='JSJ-content-check'
                    text-class='JSJ-content-check-text'
                    checked={backCheck}
                    title='添加返程送机'
                    onChange={this.handleBackCheck}
                  />
                  <View className='JSJ-content-check-tip'>往返更优惠</View> */}
                  {backCheck && (
                    <View>
                      <View className='JSJ-content-item'>
                        <View className='JSJ-content-item-label'>上车地点</View>
                        <LocationInput
                          wrap-class='JSJ-content-item-value'
                          title={start_place_back.title}
                          onChange={this.handleStartPlaceBack}
                          placeholder='请选择上车地点'
                        />
                      </View>
                      <View className='JSJ-content-item'>
                        <View className='JSJ-content-item-label'>送达地点</View>
                        <LocationInput
                          wrap-class='JSJ-content-item-value'
                          title={target_place_back.title}
                          onChange={this.handleStartPlaceBack}
                          placeholder='请选择下车地点'
                        />
                      </View>
                      <View className='JSJ-content-item'>
                        <View className='JSJ-content-item-label'>用车时间</View>
                        <DateTimePicker
                          wrap-class='JSJ-content-item-value'
                          selected-item-day-extern='JSJ-content-item-time-day'
                          selected-item-week-extern='JSJ-content-item-week-day'
                          onOk={this.handleStartTimeBack}
                          hidePassed
                          initValue={start_time_back}
                          placeholder='请输入用车时间'
                        />
                      </View>
                    </View>
                  )}
                </View>
              )}
              <View className='JSJ-content-button' onClick={debounce(this.handleOK, 100)}>
                立即预约
              </View>
              <View className='JSJ-content-ensure'>
                {ensures.map((item, index) => (
                  <View className='ensure-item' key={`ensure-item-${index}`}>
                    <Image
                      className='ensure-item-image'
                      src={item.icon}
                      mode='aspectFill'
                    />
                    <View className='ensure-item-title'>{item.title}</View>
                    <View className='ensure-item-subtitle'>
                      {item.subtitle}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default JSJPage
