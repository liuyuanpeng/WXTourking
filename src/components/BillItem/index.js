import Taro from '@tarojs/taro'
import { View, Image, Label } from '@tarojs/components'
import dayjs from 'dayjs'
import CheckBox from '../CheckBox'
import ORDER_TYPE from '@constants/types'

import './index.scss'

const carPng = IMAGE_HOST + '/images/car.png'
const giftPng = IMAGE_HOST + '/images/gift.png'

class BillItem extends Taro.Component {
  static defaultProps = {
    chexing: {},
    zuowei: {},
    order: {},
    private_consume: {},
    canCheck: false,
    checked: false,
    onCheck: null
  }

  onChange = checked => {
    const {onCheck} = this.props
    onCheck && onCheck(checked)
  }

  render() {
    const { chexing, zuowei, order, private_consume, canCheck, checked } = this.props
    const type = ORDER_TYPE[order.scene]
    let image
    if (private_consume && private_consume.images) {
      image = private_consume.images.split(',')[0]
    }
    return (
      <View className='bill-item'>
        {canCheck && <CheckBox wrap-class='bill-item-check' onChange={this.onChange} checked={checked} />}
        <View className={canCheck ? 'bill-item-right' : ''}>
        <Image
          className='bill-item-icon'
          src={type === '伴手礼' ? giftPng : carPng}
          mode='aspectFill'
        />
        <View className='bill-item-type-text'>{type}</View>
    <View className='bill-item-status-text'>{canCheck ? '可开具' : '已开具'}</View>
        {!private_consume || !private_consume.id ? (
          <View className='bill-normal'>
            <View className='bill-normal-title'>{`${order.start_place}-${order.target_place}`}</View>
            {type==='按天包车' && (
              <View className='bill-normal-text'>{`包车天数: ${order.day || 0}天`}</View>
            )}
            <View className='bill-normal-text'>{`用车时间:${dayjs(
              order.start_time
            ).format('YYYY-MM-DD')}`}</View>
            <View className='bill-normal-text'>
              {`车型:${chexing.name}${zuowei.name}座`}
            </View>
            <View className='bill-price'>
              {canCheck ? '合计' : '发票金额'}
              <Label className='bill-price-total'>{`￥ ${order.price}`}</Label>
            </View>
          </View>
        ) : (
          <View className='bill-template'>
            <Image
              className='bill-template-image'
              src={image}
              mode='aspectFill'
            />
            <View className='bill-template-detail'>
              <View className='bill-template-title'>
                {private_consume.name}
              </View>
              {type === '按天包车' && (
                <View className='bill-template-text'>{`包车天数: ${order.day || 0}天`}</View>
              )}
              {type==='伴手礼' && (
                <View className='bill-template-text'>{`商品数量: x${order.count || 1}`}</View>
              )}
              <View className='bill-template-text'>
                {type === '伴手礼' ? `下单时间: ${dayjs(order.create_time).format('YYYY-MM-DD')}` : `用车时间: ${dayjs(order.start_time).format('YYYY-MM-DD')}`}
                {``}
              </View>
              {type !== '伴手礼' && (
              <View className='bill-template-text'>{`车型: ${chexing.name || ''}${zuowei.name|| ''}座`}</View>
            )}
            </View>
            
            <View className='bill-price'>
              
            {canCheck ? '合计' : '发票金额'}
              <Label className='bill-price-total'>{`￥ ${order.price}`}</Label>
            </View>
          </View>
        )}
        </View>
      </View>
    )
  }
}
export default BillItem
