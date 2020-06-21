import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import '../common/index.scss'
import './index.scss'

import service_assurance_png from '../../asset/images/service_assurance.png'
import precious_png from '../../asset/images/precious.png'
import free_waiting_png from '../../asset/images/free_waiting.png'
import safe_png from '../../asset/images/safe.png'

import { AtInput } from 'taro-ui'
import SysNavBar from '../../components/SysNavBar'
import { returnFloat } from '../../utils/tool'
import SwitchButton from '../../components/SwitchButton'
import dayjs from 'dayjs'
import LocationInput from '../../components/LocationInput'
import DateTimePicker from '../../components/DateTimePicker'
import CheckBox from '../../components/CheckBox'

@connect(({ system }) => ({
  info: system.info
}))
class JSJPage extends Component {
  config = {
    navigationBarTitleText: '接送机'
  }

  state = {
    isSJ: false,
    start_place: { title: '' },
    target_place: { title: '' },
    start_time: dayjs(),
    fly: '',
    backCheck: false,
    start_place_back: { title: '' },
    target_place_back: { title: '' },
    start_time_back: dayjs()
  }

  handleTypeChange = value => {
    this.setState({
      isSJ: value
    })
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

  componentDidMount() {}

  handleStartPlace = location => {
    this.setState({
      start_place: location
    })
  }

  handleTargetPlace = location => {
    this.setState({
      target_place: location
    })
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

  handleOK = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../carType/index'
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
    const { windowHeight = 0, windowWidth } = this.props.info
    if (!windowHeight) return <View></View>
    const scrollStyle = {
      height: `${windowHeight * (705 / windowWidth) - 350}rpx`
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
                      onOk={this.handleFlyChange}
                      value={fly}
                      placeholder='请填写航班号'
                    />
                  </View>
                  <CheckBox
                    wrap-class='JSJ-content-check'
                    text-class='JSJ-content-check-text'
                    checked={backCheck}
                    title='添加返程送机'
                    onChange={this.handleBackCheck}
                  />
                  <View className='JSJ-content-check-tip'>往返更优惠</View>
                  {backCheck && (
                    <View>
                      <View className='JSJ-content-item'>
                        <View className='JSJ-content-item-label'>
                          机场/火车站
                        </View>
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
              <View className='JSJ-content-button' onClick={this.handleOK}>立即预约</View>
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
