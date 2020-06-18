import Taro from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'
import dayjs from 'dayjs'
import CheckBox from '../CheckBox'

import './index.scss'

import carPng from '../../asset/images/car.png'
import giftPng from '../../asset/images/gift.png'

class BillItem extends Taro.Component {
  static defaultProps = {
    type: '',
    data: {},
    canCheck: false,
    checked: false,
    onCheck: null
  }

  onChange = checked => {
    const {onCheck} = this.props
    onCheck && onCheck(checked)
  }

  render() {
    const { type, data, canCheck, checked } = this.props
    return (
      <View className='bill-item'>
        {canCheck && <CheckBox wrap-class='bill-item-check' onChange={this.onChange} checked={checked} />}
        <View className={canCheck ? 'bill-item-right' : ''}>
        <Image
          className='bill-item-icon'
          src={type === 'gift' ? giftPng : carPng}
          mode='aspectFill'
        />
        <View className='bill-item-type-text'>{type}</View>
    <View className='bill-item-status-text'>{canCheck ? '可开具' : '已开具'}</View>
        {type === 'jiesongji' || type === 'daySchedule' ? (
          <View className='bill-normal'>
            <View className='bill-normal-title'>{`${data.start_place}-${data.target_place}`}</View>
            {data.day && (
              <View className='bill-normal-text'>{`包车天数${data.day}天`}</View>
            )}
            <View className='bill-normal-text'>{`用车时间:${dayjs(
              data.time
            ).format('YYYY-MM-DD')}`}</View>
            <View className='bill-normal-text'>
              {`车型:${data.car.type}${data.car.sit}座`}
            </View>
            <View className='bill-price'>
              {canCheck ? '合计' : '发票金额'}
              <Label className='bill-price-total'>{`￥ ${data.price}`}</Label>
            </View>
          </View>
        ) : (
          <View className='bill-template'>
            <Image
              className='bill-template-image'
              src={data.template.image}
              mode='aspectFill'
            />
            <View className='bill-template-detail'>
              <View className='bill-template-title'>
                {data.template.title}
              </View>
              {data.day && (
                <View className='bill-template-text'>{`包车天数${data.day}天`}</View>
              )}
              {data.count && (
                <View className='bill-template-text'>{`商品数量: x${data.count}`}</View>
              )}
              <View className='bill-template-text'>
                {type === 'gift' ? '下单' : '用车'}
                {`时间: ${dayjs(data.time).format('YYYY-MM-DD')}`}
              </View>
              {type !== 'gift' && (
              <View className='bill-template-text'>{`车型: ${data.car.type}${data.car.sit}座`}</View>
            )}
            </View>
            
            <View className='bill-price'>
              
            {canCheck ? '合计' : '发票金额'}
              <Label className='bill-price-total'>{`￥ ${data.price}`}</Label>
            </View>
          </View>
        )}
        </View>
      </View>
    )
  }
}
export default BillItem
