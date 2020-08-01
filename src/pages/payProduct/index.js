import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

const daySchedulePng = IMAGE_HOST + '/images/bkg4.png'
import { AtDivider, AtNavBar, AtInputNumber, AtInput } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import DateTimePicker from '@components/DateTimePicker'
import LocationInput from '@components/LocationInput'


class PayProduct extends Component {
  config = {
    navigationBarTitleText: '订单支付'
  }

  state = {
    start_place: '',
    name: '',
    phone: '',
    start_time: new Date().getTime()
  }

  componentWillMount() {}

  onMoreAddress = e => {
    e.stopPropagation()
    console.log('onMoreAddress')
  }

  handleChange = value => {
    this.setState({
      count: value
    })
  }

  handlePay = e => {
    e.stopPropagation()
    console.log('handlePay')
    Taro.navigateTo({
      url: '../orderStatus/index'
    })
  }

  timeAction = e => {
    e.stopPropagation()
    console.log('timeAction')
  }

  handleLocationChange = obj => {
    this.setState({
      start_place: obj.title
    })
  }

  render() {
    const { start_place = '厦门市思明区', name, phone, start_time } = this.state
    return (
      <View className='pay-product' style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}>
        <SysNavBar title='订单支付' />
        <View className='pay-product-header'>
          <Image
            className='header-image'
            src={daySchedulePng}
            mode='aspectFill'
          />
          <View className='header-right'>
            <View className='header-title'>厦门胡里山炮台</View>
            <View className='header-subtitle'>八闽门户，天南锁钥</View>
            <View className='header-declare'>付款后司机会主动联系您</View>
            <View className='header-price'>￥{returnFloat(224)}</View>
          </View>
        </View>
        <View className='pay-product-detail'>
          <View className='detail-item'>
            <View className='detail-label'>上车地点</View>
            <LocationInput
              wrap-class='detail-content'
              title={start_place}
              placeholder='请选择上车地点'
              onChange={this.handleLocationChange}
            />
            <View className='location-icon' onClick={this.onLocate}></View>
          </View>
          <View className='detail-split' />
          <View className='detail-item'>
            <View className='detail-label'>乘车人姓名</View>
            <AtInput
              className='detail-input'
              value={name}
              placeholder='请输入姓名'
            />
          </View>
          <View className='detail-split' />
          <View className='detail-item'>
            <View className='detail-label'>乘车人手机号</View>
            <AtInput
              type='phone'
              className='detail-input'
              value={phone}
              placeholder='请输入手机号'
            />
          </View>
          <View className='detail-split' />
          <View className='detail-item' onClick={this.timeAction}>
            <View className='detail-label'>用车时间</View>
            <DateTimePicker
              wrap-class='detail-content'
              onOk={this.onOK}
              showDayOnly
              hidePassed
              placeholder='请选择日期'
            />
            <View className='time-icon'></View>
          </View>
        </View>
        <View className='pay-gift-footer'>
          <Label className='pay-it' onClick={this.handlePay}>
            立即支付
          </Label>
          <Label className='total-footer'>{`￥${returnFloat(224)}`}</Label>
          <Label className='sum-text'>合计：</Label>
        </View>
      </View>
    )
  }
}

export default PayProduct
