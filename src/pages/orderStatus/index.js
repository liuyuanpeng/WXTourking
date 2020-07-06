import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, ScrollView } from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
import '../common/index.scss'
import './index.scss'

import daySchedulePng from '../../asset/images/bkg4.png'
import { AtDivider, AtNavBar, AtInputNumber, AtInput } from 'taro-ui'
import CommentItem from '../../components/CommentItem'
import SysNavBar from '../../components/SysNavBar'
import { returnFloat } from '../../utils/tool'
import dayjs from 'dayjs'


class PayProduct extends Component {
  config = {
    navigationBarTitleText: '确认订单'
  }

  state = {}

  

  render() {
    const {
      carType = {
        title: '经济5座',
        luggage: '2件行李'
      },
      days = 1,
      start_time = dayjs(),
      start_place = '厦门大学(厦门市思明区)',
      target_place = '漳州六鳌珍珠湾',
      fly = 'SC4604',
      order_id = '12343124123',
      name = '张三',
      phone = '15605085028',
      price = 1374
    } = this.props

    const orderInfos = [
      {
        label: '订单号',
        value: order_id
      },
      {
        label: '乘车人',
        value: name
      },
      {
        label: '手机号',
        value: phone
      },
      {
        label: '服务商',
        value: '旅王出行'
      }
    ]

    
    const scrollStyle = {
      top: 88 + Taro.$statusBarHeight + 'rpx',
      height: Taro.$windowHeight - 88 - Taro.$statusBarHeight + 'rpx'
    }

    return (
      <ScrollView
        className='pay-product-scroll'
        scrollY
        scrollWithAnimation
        style={scrollStyle}
      >
        <View className='pay-product'>
          <SysNavBar title='确认订单' />
          <View className='pay-product-header'>
            <View className='pay-product-tip'>
              您的订单尚未完成支付，请重新支付
            </View>
            <Image
              className='header-image'
              src={daySchedulePng}
              mode='aspectFill'
            />
            <View className='header-right'>
              <View className='header-title'>厦门胡里山炮台</View>
              <View className='header-subtitle'>八闽门户，天南锁钥</View>
              <View className='header-declare'>付款后司机会主动联系您</View>
              <View className='header-price'>￥{returnFloat(price)}</View>
            </View>
          </View>
          <View className='pay-product-header-ex'>
            <View className='pay-product-tip'>
              我们会在4月20日 18:20前确认车辆信息
            </View>
            <View className='pay-product-header-ex-price'>
              ￥{returnFloat(price)}
            </View>
            <View className='pay-product-header-ex-title'>{carType.title}</View>
            <View className='pay-product-header-ex-subtitle'>{`${fly} 航班实际到达后用车`}</View>
            <View className='pay-product-header-ex-place'>
              <View className='pay-product-header-ex-place-start'>
                {start_place}
              </View>
              <View className='pay-product-header-ex-place-target'>
                {target_place}
              </View>
            </View>
          </View>
          <View className='pay-product-pay-btn'>继续支付</View>
          <View className='pay-product-info'>
            <View className='pay-product-tip'>
              我们会在4月20日 18:20前确认车辆信息
            </View>
            <View className='pay-product-info-label'>
              {`车型:  ${carType.title}`}
              <Label className='pay-product-info-luggage'>
                {carType.luggage}
              </Label>
            </View>
            <View className='pay-product-info-label'>{`用车时间:  ${start_time.format(
              'YYYY年MM月DD日 HH:mm'
            )}`}</View>
            <View className='pay-product-info-label'>{`上车地点:  ${start_place}`}</View>
          </View>
          <View className='pay-product-passenger'>
            {orderInfos.map((item, index) => (
              <View
                className={`pay-product-passenger-item${
                  index > 0 ? ' pay-product-passenger-split-line' : ''
                }`}
                key={`pay-product-passenger-item-${index}`}
              >
                <Label className='pay-product-passenger-item-label'>
                  {item.label}
                </Label>
                <Label className='pay-product-passenger-item-value'>
                  {item.value}
                </Label>
              </View>
            ))}
          </View>
          <View className='pay-product-tourist'>
            <View className='pay-product-tourist-item'>
              <View className='pay-product-tourist-item-title'>乘车人姓名</View>
              <View className='pay-product-tourist-item-value'>{name}</View>
            </View>
            <View className='pay-product-tourist-item pay-product-tourist-item-border'>
              <View className='pay-product-tourist-item-title'>
                乘车人手机号
              </View>
              <View className='pay-product-tourist-item-value'>{phone}</View>
            </View>
            <View className='pay-product-tourist-item pay-product-tourist-item-border'>
              <View className='pay-product-tourist-item-title'>包车天数</View>
              <View className='pay-product-tourist-item-value'>{days}天</View>
            </View>
            <View className='pay-product-tourist-item pay-product-tourist-item-border'>
              <View className='pay-product-tourist-item-title'>用车时间</View>
              <View className='pay-product-tourist-item-value'>{name}</View>
              <View className='pay-product-tourist-item-time-icon' />
            </View>
          </View>
          {/* 优惠券 */}
          <View className='pay-product-coupon'>
            <View className='pay-product-coupon-title'>优惠券</View>
            <View className='pay-product-coupon-right'>已优惠15元</View>
          </View>
          {/* 发票 */}
          <View className='pay-product-bill'>
            <View className='pay-product-bill-title'>发票</View>
            <View className='pay-product-bill-right'>去开发票</View>
          </View>
          <View className='pay-product-cancel-btn'>取消订单</View>
        </View>
      </ScrollView>
    )
  }
}

export default PayProduct
