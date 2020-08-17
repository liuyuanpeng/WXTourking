import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, SwiperItem } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

import { AtDivider } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import PRODUCT_TYPES from '@constants/types'

const daySchedulePng = IMAGE_HOST + '/images/day_schedule.png'

@connect(({ city }) => ({
  currentCity: city.current
}))
class ProductDetail extends Component {
  config = {}

  state = {
    detail: {}
  }

  componentDidMount() {
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('acceptProductData', detail => {
      this.setState({
        detail
      })
    })
  }

  seeAll = e => {
    e.stopPropagation()
    console.log('see all')
  }

  onSubmit = e => {
    e.stopPropagation()
    const { currentCity, dispatch } = this.props
    const { detail } = this.state
    const { private_consume = {} } = detail
    if (private_consume.scene === 'BANSHOU_PRIVATE') {
      Taro.navigateTo({
        url: '../payGift/index',
        success: res => {
          res.eventChannel.emit('giftData', {...private_consume})
        }
      })
      return
    }
    dispatch({
      type: 'consume/getConsumeList',
      payload: {
        params: {
          scene: private_consume.scene,
          city_id: currentCity.id
        }
      },
      success: () => {
        Taro.navigateTo({
          url: '../carType/index',
          success: res => {
            res.eventChannel.emit('acceptData', {
              scene: private_consume.scene,
              private_consume,
              target_place: {
                title: private_consume.target_place,
                latitude: private_consume.target_latitude,
                longitude: private_consume.target_longitude
              }
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
    const { detail } = this.state
    const { private_consume = {} } = detail
    let banner = ''
    let banners = []
    try {
      banners = private_consume.images.split(',')
      banner = banners[0]
    } catch (error) {
      return null
    }
    const pDetail = {
      banner,
      title: private_consume.name,
      subtitle: private_consume.tag,
      location: private_consume.target_place,
      price: 24,
      reason: private_consume.reason,
      comments: [
        {
          user: 'test',
          avatar: daySchedulePng,
          time: new Date().getTime(),
          images: [daySchedulePng, daySchedulePng, daySchedulePng],
          comment:
            '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
        },
        {
          user: 'test',
          avatar: daySchedulePng,
          time: new Date().getTime(),
          comment:
            '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
        },
        {
          user: 'test',
          avatar: daySchedulePng,
          time: new Date().getTime(),
          comment:
            '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
        },
        {
          user: 'test',
          avatar: daySchedulePng,
          time: new Date().getTime(),
          comment:
            '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
        },
        {
          user: 'test',
          avatar: daySchedulePng,
          time: new Date().getTime(),
          comment:
            '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
        },
        {
          user: 'test',
          avatar: daySchedulePng,
          time: new Date().getTime(),
          comment:
            '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
        },
        {
          user: 'test',
          avatar: daySchedulePng,
          time: new Date().getTime(),
          comment:
            '司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞司机人很好，全称讲解的也很细致，点赞'
        }
      ],
      description: private_consume.description,

      detailBanners: banners
    }

    const comment = pDetail.comments[0]
    const type = PRODUCT_TYPES[private_consume.scene]

    console.log(type)

    return (
      <View className='product-detail'>
        <SysNavBar transparent noBorder />
        <Image className='home-png' src={pDetail.banner} mode='widthFix' />
        <View className='product-container'>
          <View className='product-title'>
            {pDetail.title}
            {type === '伴手礼' && (
              <View className='price'>{`￥${pDetail.price}`}</View>
            )}
          </View>

          <View className='subtitle'>{pDetail.subtitle}</View>
          {pDetail.location && (
            <View>
              <AtDivider lineColor='#F3F3F3' />
              <View className='location-icon' />
              <Label className='location-text'>{pDetail.location}</Label>
            </View>
          )}
          <AtDivider lineColor='#F3F3F3' />
          <View className='reason-title'>推荐理由</View>
          <View className='reason'>{pDetail.reason}</View>
          <View className='comments-title'>
            {`达人点评（${pDetail.comments.length}）`}
            <Label className='see-more' onClick={this.seeAll}>
              查看全部
            </Label>
          </View>

          <View className='comments-container'>
            <CommentItem
              avatar={comment.avatar}
              name={comment.user}
              stars={4.5}
              time={comment.time}
              comment={comment.comment}
              images={comment.images}
            />
          </View>
          <View className='detail-title'>
            {type}
            介绍
          </View>
          <View className='detail-container'>
            {pDetail.detailBanners && pDetail.detailBanners.length && (
              <Swiper autoplay className='detail-swiper'>
                {pDetail.detailBanners.map((item, index) => (
                  <SwiperItem key={`detail-banner-${index}`}>
                    <Image
                      className='detail-banner'
                      src={item}
                      mode='widthFix'
                    />
                  </SwiperItem>
                ))}
              </Swiper>
            )}
            <View className='detail-desc'>{pDetail.description || ''}</View>
          </View>
          <View className='i-want-it' onClick={this.onSubmit}>
            我想{type === '伴手礼' ? '要' : '去'}
          </View>
        </View>
      </View>
    )
  }
}

export default ProductDetail
