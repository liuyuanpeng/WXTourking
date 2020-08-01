import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, SwiperItem } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import {returnFloat} from '@utils/tool'


class PayGift extends Component {
  config = {
    navigationBarTitleText: '订单支付'
  }

  state = {
    count: 1
  }

  componentWillMount() {}

  onMoreAddress = e => {
    e.stopPropagation()
    console.log('onMoreAddress')
    Taro.navigateTo({
      url: `../address/index`
    })
  }

  handleChange = value => {
    this.setState({
      count: value
    })
  }

  handlePay = e => {
    e.stopPropagation()
    console.log('handlePay')
  }

  render() {
    const { count } = this.state
    const { price = 1 } = this.props
    return (
      <View className='pay-gift' style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}>
        <SysNavBar title='订单支付' />
        <View className='address'>
          <View className='address-icon' />
          <View className='address-details'>
            <Label className='name'>张三</Label>
            <Label className='phone'>18343323433</Label>
            <View className='address-text'>
              福建省厦门市湖里区江头街道冠鸿花园312号福建省厦门市湖里区江头街道冠鸿花园312号
            </View>
          </View>
          <View className='more-address' onClick={this.onMoreAddress} />
        </View>
        <View className='gift-container'>
          <Image className='gift-image' mode='aspectFill' />
          <View className='gift-detail'>
            <View className='gift-name'>苏小糖牛轧糖</View>
            <View className='gift-subtitle'>地道的厦门风味小吃</View>
            <View className='gift-transport'>付款后三天内发货</View>
            <View className='gift-price'>
              ￥24 <View className='gift-count-minus'>{`×${count}`}</View>
            </View>
          </View>
          <View className='gift-count'>
            购买数量
            <AtInputNumber
              className='input-number'
              disabledInput
              min={1}
              value={count}
              onChange={this.handleChange}
            />
          </View>
          <View className='summary'>
            <Label className='sum'>{`共${count}件`}</Label>
            小计:
            <Label className='total'>{`￥${returnFloat(price * count)}`}</Label>
          </View>
        </View>
        <View className='pay-gift-footer'>
          <Label className='pay-it' onClick={this.handlePay}>
            立即支付
          </Label>
          <Label className='total-footer'>{`￥${returnFloat(price * count)}`}</Label>
          <Label className='sum-text'>合计：</Label>
          <Label className='sum-footer'>{`共${count}件，`}</Label>
        </View>
      </View>
    )
  }
}

export default PayGift
