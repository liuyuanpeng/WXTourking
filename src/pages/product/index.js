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
import { debounce } from 'debounce'

@connect(({ city, evaluate }) => ({
  currentCity: city.current,
  data: evaluate.list
}))
class ProductDetail extends Component {
  config = {}

  state = {
    detail: {}
  }

  componentDidMount() {
    const id = this.$router.params.id
    if (id) {
      this.props.dispatch({
        type: 'product/getProduct',
        id,
        success: detail => {
          this.setState({
            detail
          })
          // 获取评论
          const { private_consume = {} } = detail
          if (private_consume.id) {
            this.props.dispatch({
              type: 'evaluate/getEvaluateList',
              payload: {
                page: 0,
                size: 100,
                private_consume_id: private_consume.id
              },
              fail: msg => {
                Taro.showToast({
                  title: msg || '获取热门评论失败',
                  icon: 'none'
                })
              }
            })
          }
        }
      })
      return
    }
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('acceptProductData', detail => {
      this.setState({
        detail
      })

      // 获取评论
      const { private_consume = {} } = detail
      if (private_consume.id) {
        this.props.dispatch({
          type: 'evaluate/getEvaluateList',
          payload: {
            page: 0,
            size: 100,
            private_consume_id: private_consume.id
          },
          fail: msg => {
            Taro.showToast({
              title: msg || '获取热门评论失败',
              icon: 'none'
            })
          }
        })
      }
    })
  }

  onShareAppMessage = () => {
    const { detail } = this.state
    const { private_consume } = detail
    if (!private_consume || !private_consume.id)
      var shareObj = {
        title: '旅王出行', // 默认是小程序的名称(可以写slogan等)
        path: '/pages/product/index?id=' + private_consume.id, // 默认是当前页面，必须是以‘/’开头的完整路径
        imageUrl: '',
        success: res => {
          // 转发成功之后的回调
          if (res.errMsg == 'shareAppMessage:ok') {
            Taro.showToast({
              title: '发送成功',
              icon: 'success'
            })
          }
        },
        fail: res => {
          // 转发失败之后的回调
          if (res.errMsg == 'shareAppMessage:fail cancel') {
            // 用户取消转发
          } else if (res.errMsg == 'shareAppMessage:fail') {
            // 转发失败，其中 detail message 为详细失败信息
          }
        }
      } // 返回shareObj
    return shareObj
  }

  seeAll = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../comments/index'
    })
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
          res.eventChannel.emit('giftData', { ...private_consume })
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

  renderComment = comment => {
    return comment ? (
      <View className='comments-container'>
        <CommentItem
          key={comment.id}
          name={comment.nick_name || comment.username || comment.user_id}
          avatar={comment.avatar || ''}
          stars={comment.evaluate / 2}
          time={comment.create_time}
          comment={comment.content}
          images={comment.image ? comment.image.split(',') : []}
        />
      </View>
    ) : null
  }

  render() {
    const { data } = this.props
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
      comments: data,
      description: private_consume.description,

      detailBanners: banners
    }

    const comment = data[0]
    const type = PRODUCT_TYPES[private_consume.scene]

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
            <Label className='see-more' onClick={debounce(this.seeAll, 100)}>
              查看全部
            </Label>
          </View>

          {this.renderComment(comment)}
          <View className='detail-title'>
            {type}
            介绍
          </View>
          <View className='detail-container'>
            {pDetail.detailBanners &&
              pDetail.detailBanners.length > 1 &&
              pDetail.detailBanners.map((item, index) =>
                index > 0 ? (
                  <Image
                    key={`detail-banner-${index}`}
                    className='detail-banner'
                    src={item}
                    mode='widthFix'
                  />
                ) : null
              )}
            <View className='detail-desc'>{pDetail.description || ''}</View>
          </View>
          <View className='i-want-it' onClick={debounce(this.onSubmit, 100)}>
            我想{type === '伴手礼' ? '要' : '去'}
          </View>
        </View>
      </View>
    )
  }
}

export default ProductDetail
