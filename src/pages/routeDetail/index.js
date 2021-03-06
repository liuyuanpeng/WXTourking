import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  Text
} from '@tarojs/components'
import '../../common/index.scss'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { connect } from 'react-redux'
import './index.scss'

import { AtDivider, AtTabs } from 'taro-ui'
import { debounce } from 'debounce'

@connect(({ city, evaluate }) => ({
  currentCity: city.current,
  comments: evaluate.list
}))
class ProductDetail extends Component {
  config = {}

  state = {
    current: 0,
    detail: {}
  }

  handleClick = current => {
    this.setState({
      current
    })
    const ids = ['detail', 'fee', 'notice']
    Taro.pageScrollTo({
      selector: `#${ids[current]}`
    })
  }

  componentDidMount() {
    const id = Taro.getCurrentInstance().router.params.id
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
    const eventChannel = Taro.getCurrentInstance().page.getOpenerEventChannel()
    eventChannel.on('roadData', detail => {
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
        path: '/pages/routeDetail/index?id=' + private_consume.id, // 默认是当前页面，必须是以‘/’开头的完整路径
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
    const { type } = this.state
    if (type === 'gift') {
      Taro.navigateTo({
        url: `../payGift/index`
      })
    } else {
      Taro.navigateTo({
        url: `../payProduct/index`
      })
    }
  }

  handleOK = e => {
    e.stopPropagation()
    const { detail } = this.state
    const { private_consume, car_levels } = detail
    if (!private_consume.price) return
    const { scene, price } = private_consume
    const { currentCity } = this.props
    const data = {
      scene,
      city_id: currentCity.id,
      private_consume,
      price
    }
    if (car_levels && car_levels.length) {
      const { chexing, zuowei } = car_levels[0]
      data.chexing = chexing
      data.zuowei = zuowei
    }
    Taro.navigateTo({
      url: '../createOrder/index',
      success: res => {
        res.eventChannel.emit('orderData', data)
      }
    })
  }

  renderComment = comment => {
    return comment ? (
      <View className='comments-container'>
        <CommentItem
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
    const { comments } = this.props
    const { detail } = this.state
    const { private_consume = {}, roads = [], car_levels = [] } = detail
    const carLevel = car_levels[0] || {}
    const { chexing={}, zuowei={} } = carLevel
    let banner
    let banners
    try {
      banners = private_consume.images ? private_consume.images.split(',') : []
      banner = banners[0]
    } catch (error) {
      return <View></View>
    }
    const routes = []
    roads.map(item => {
      const images = item.images ? item.images.split(',') : []
      routes.push({
        title: item.name,
        content: item.day_road,
        images
      })
    })
    const pDetail = {
      banner,
      title: private_consume.name,
      subtitle: private_consume.tag,
      price: private_consume.price,
      reason: private_consume.reason,
      comments,
      detail: private_consume.description || '',
      detailBanners: banners,
      routes,
      fee: [
        {
          title: '费用包含',
          content: private_consume.price_include
        },
        {
          title: '费用不含',
          content: private_consume.price_exclude
        }
      ],
      notice: [
        {
          title: '成团承诺',
          content: private_consume.promise
        },
        {
          title: '购买须知',
          content: private_consume.advance_notice
        },
        {
          title: '退订规则',
          content: private_consume.refund_rule
        }
      ]
    }

    const tabList = [
      {
        title: '行程说明'
      },
      {
        title: '费用说明'
      },
      {
        title: '预订须知'
      }
    ]

    const comment = comments[0]

    return (
      <View className='product-detail'>
        <SysNavBar transparent noBorder />
        <Image className='home-png' src={pDetail.banner} mode='widthFix' />
        <View className='product-container'>
          <View className='product-title'>{pDetail.title}</View>

          <View className='subtitle'>{pDetail.subtitle}</View>
          <AtDivider lineColor='#F3F3F3' />
          <View className='reason-title'>
            车辆: {(chexing.name || '') + (zuowei.name || '')}
          </View>
          <View className='reason-title'>推荐理由</View>
          <View className='reason'>{pDetail.reason}</View>
          <View className='comments-title'>
            {`达人点评（${pDetail.comments.length}）`}
            <Label className='see-more' onClick={debounce(this.seeAll, 100)}>
              查看全部
            </Label>
          </View>

          {this.renderComment(comment)}
        </View>

        <View className='route-detail-container'>
          <AtTabs
            current={this.state.current}
            tabList={tabList}
            onClick={this.handleClick}
          />

          <View id='detail' className='route-detail'>
            <View className='route-detail-title'>行程信息</View>
            <View className='route-detail-content'>
              {pDetail.routes &&
                pDetail.routes.map((item, index) => (
                  <View
                    className={`route-detail-item ${
                      index < pDetail.routes.length - 1
                        ? 'route-detail-item-border'
                        : ''
                    }`}
                    key={`route-detail-item-${index}`}
                  >
                    <View className='route-detail-item-title'>
                      {item.title}
                    </View>
                    {item.images &&
                      item.images.length > 1 &&
                      item.images.map((image, INDEX) =>
                        INDEX > 0 ? (
                          <Image
                            key={`route-detail-item-image-${INDEX}`}
                            className='route-detail-item-image'
                            src={image}
                            mode='widthFix'
                          />
                        ) : null
                      )}
                    {item.content && (
                      <Text className='route-detail-item-content'>
                        {item.content}
                      </Text>
                    )}
                  </View>
                ))}
            </View>
          </View>

          <View id='fee' className='route-detail'>
            <View className='route-detail-title'>费用说明</View>
            {pDetail.fee &&
              pDetail.fee.map((item, index) => (
                <View
                  className='route-detail-fee'
                  key={`route-detail-fee-${index}`}
                >
                  <View className='route-detail-fee-title'>{item.title}</View>
                  <Text className='route-detail-fee-subtitle'>
                    {item.content}
                  </Text>
                </View>
              ))}
          </View>

          <View id='notice' className='route-detail'>
            <View className='route-detail-title'>预订须知</View>
            {pDetail.notice &&
              pDetail.notice.map((item, index) => (
                <View
                  className='route-detail-fee'
                  key={`route-detail-fee-${index}`}
                >
                  <View className='route-detail-fee-title'>{item.title}</View>
                  <Text className='route-detail-fee-subtitle'>
                    {item.content}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        <View className='footer'>
          <View className='footer-price'>
            ￥{pDetail.price}
            <Label className='footer-price-unit'>起</Label>
          </View>
          <View className='footer-btn' onClick={debounce(this.handleOK, 100)}>
            下一步
          </View>
        </View>
      </View>
    )
  }
}

export default ProductDetail
