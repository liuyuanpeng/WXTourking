import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image, Label, ScrollView } from '@tarojs/components'
import { AtInput, AtInputNumber } from 'taro-ui'
import { connect } from '@tarojs/redux'

import '../../asset/common/index.scss'
import './index.scss'

import SysNavBar from '@components/SysNavBar'
import LocationInput from '@components/LocationInput'
import DateTimePicker from '@components/DateTimePicker'
import DaysPicker from '@components/DaysPicker'
import DecorateTitle from '@components/DecorateTitle'
import CommentItem from '@components/CommentItem'
import dayjs from 'dayjs'

import service_assurance_png from '@images/service_assurance.png'
import precious_png from '@images/precious.png'
import free_waiting_png from '@images/free_waiting.png'
import safe_png from '@images/safe.png'

@connect(({})=>({
}))
class DayChartered extends PureComponent {
  config = {
    navigationBarTitleText: ''
  }

  state = {
    start_place: {title: ''},
    start_time: dayjs(),
    days: 1
  }

  onOK = value => {
    this.setState({
      start_time: value
    })
  }

  handleDaysChange = value => {
    this.setState({
      days: value.currentDays
    })
  }
  

  handleLocationChange = location => {
    this.setState({
      start_place: location
    })
  }

  handleChartered = e => {
    e.stopPropagation()
    const {start_place, start_time, days} = this.state
    console.log(start_place)
    let msg = ''
    if (start_place && start_place.title && start_place.latitude && start_place.longitude) {
      if (start_time && start_time.isBefore(dayjs())) {
        msg = '请输入正确的用车时间'
      }
    } else {
      msg = '请输入上下车地点'
    }

    if (msg) {
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    Taro.navigateTo({
      url: '../pkg/index',
      success: res => {
        res.eventChannel.emit('acceptCharterData', {
          start_place,
          target_place: start_place,
          start_time,
          scene: 'DAY_PRIVATE',
          days
        })
      }
    })
  }

  render() {
    
    const scrollStyle = {
      height: `${Taro.$windowHeight}rpx`
    }
    const comments = [
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        images: [safe_png, safe_png, safe_png],
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      },
      {
        user: 'test',
        avatar: safe_png,
        time: new Date().getTime(),
        comment:
          '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
      }
    ]

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

    const products = [
      {
        image:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
        title: '厦门世茂双子塔',
        look_count: 928,
        price: 70,
        pay_count: 912
      },
      {
        image:
          'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
        title: '厦门鼓浪屿往返船票',
        look_count: 928,
        price: 35,
        pay_count: 912
      }
    ]

    const { start_place, start_time, days } = this.state
    return (
      <View className='day-chartered-page'>
        <SysNavBar transparent />
        <ScrollView style={scrollStyle} scrollY scrollWithAnimation>
          <View className='day-chartered-bkg' />
          <View className='day-chartered-content'>
            <View className='day-chartered-header'>
              <View className='label-name label-place'>上下车地点</View>
              <LocationInput
                wrap-class='label-place-input'
                title={start_place.title}
                placeholder='请选择上下车地点'
                onChange={this.handleLocationChange}
              />
              <View className='split-line' />
              <View className='label-name label-time'>用车时间</View>
              <DateTimePicker
                wrap-class='label-time-input'
                selected-item-class='label-time-input-item'
                onOk={this.onOK}
                hidePassed
                initValue={start_time}
                placeholder='请选择用车时间'
              />
              <View className='label-name label-day'>包车天数</View>
              <DaysPicker
                wrap-class='label-day-input'
                selected-item-class='label-day-input-item'
                initValue={days}
                onOk={this.handleDaysChange}
              />
              <View className='split-line' />
              <View className='chartered-btn' onClick={this.handleChartered}>
                立即包车
              </View>
              <View className='chartered-ensure'>
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
            <View className='day-chartered-recommend'>
              <DecorateTitle title='大家都在看' />
              <Label onClick={this.onSeeMore} className='see-more'>
                查看更多
              </Label>
              <View className='product-list'>
                {products.map((item, index) => (
                  <View className='product-item' key={`product-item-${index}`}>
                    <Image
                      src={item.image}
                      className='product-item-image'
                      mode='aspectFill'
                    />
                    <View className='product-item-title'>{item.title}</View>
                    <View className='product-item-look'>
                      {item.look_count}名旅客浏览
                    </View>
                    <Label className='price-icon'>￥</Label>
                    <Label className='price'>{item.price}</Label>
                    <Label className='pay-count'>{item.pay_count}人已购</Label>
                  </View>
                ))}
              </View>
            </View>
            <View className='day-chartered-comments'>
              <DecorateTitle title='大家都在说' />
              <Label onClick={this.onSeeMore} className='see-more'>
                查看更多
              </Label>
              {comments.map((comment, index) => (
                <View key={`comment-item-${index}`}>
                  {index > 0 && <View className='split-line' />}
                  <CommentItem
                    avatar={comment.avatar}
                    name={comment.user}
                    stars={4.5}
                    time={comment.time}
                    comment={comment.comment}
                    images={comment.images}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default DayChartered
