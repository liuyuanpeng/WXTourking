import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { View, Image, Label, Swiper, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
// import '../../common/index.scss'
import './index.scss'

import {
  AtCheckbox,
  AtNavBar,
  AtInputNumber,
  AtImagePicker,
  AtTabs,
  AtTabsPane,
  AtToast,
  AtRate,
  AtTextarea
} from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import CouponItem from '@components/CouponItem'
import STORAGE from '../../constants/storage'
import dayjs from 'dayjs'

@connect(({order}) => ({
  data: order.userOrder
}))
class Evaluate extends Component {
  config = {
    navigationBarTitleText: '发表评价'
  }

  state = {
    rate: 5,
    content: '',
    images: [],
    showToast: false,
    toast: {
      duration: 3000,
      hasMask: false,
      text: ''
    }
  }

  handleRate = value => {
    this.setState({
      rate: value
    })
  }

  handleContent = value => {
    this.setState({
      content: value
    })
  }

  handleImages = files => {
    this.setState({
      images: files
    })
  }

  progressEvaluate = image => {
    const { content, rate } = this.state
    const { dispatch, data } = this.props
    const { private_consume, order } = data
    const payload = {
      content,
      driver_user_id: order.driver_user_id,
      evaluate: rate * 2,
      image: image || '',
      order_id: order.id,
      private_consume_id: private_consume ? private_consume.id : '',
      user_id: order.user_id
    }
    dispatch({
      type: private_consume
        ? 'evaluate/evaluateOrder'
        : 'evaluate/evaluateDriver',
      payload,
      success: () => {
        Taro.navigateBack()
        this.setState({
          showToast: true,
          toast: {
            text: '评价成功',
            icon: ''
          }
        })
      },
      fail: msg => {
        this.setState({
          showToast: true,
          toast: {
            text: msg || '评价失败',
            icon: ''
          }
        })
      }
    })
  }

  handleEvaluate = e => {
    const { content } = this.state
    if (!content.trim()) {
      this.setState({
        showToast: true,
        toast: {
          text: '请填写评价内容'
        }
      })
      return
    }
    e.stopPropagation()
    const { images } = this.state
    if (images && images.length) {
      this.setState({
        showToast: true,
        toast: {
          text: '上传图片...',
          icon: 'loading-3',
          duration: 0,
          hasMask: true
        }
      })
      Taro.uploadFile({
        url: HOST + '/v5/file/local/qiniu_wechat_upload?file_key=file',
        filePath: images[0].file.path,
        name: 'file',
        header: {
          token: Taro.getStorageSync(STORAGE.TOKEN)
        },
        success: res => {
          this.setState({
            showToast: false,
            toast: {text: '', icon: '', duration: 3000, hasMask: false}
          })
          const DATA = JSON.parse(res.data)
          if (DATA.code === 'SUCCESS') {
            this.progressEvaluate(DATA.data.path)
          }
        },
        fail: () => {
          this.setState({
            showToast: false,
            toast: {text: '', icon: '', duration: 3000, hasMask: false}
          })
        }
      })
    } else {
      this.progressEvaluate()
    }
  }

  render() {
    const {data} = this.props

    const { rate, content, images, showToast, toast } = this.state

    const { chexing = {}, zuowei = {}, private_consume = {}, order = {} } = data

    const {
      price,
      start_place,
      target_place,
      scene,
      create_time,
      start_time,
      count
    } = order

    return (
      <View
        className='evaluate-page'
        style={{
          top: 88 + window.$statusBarHeight + 'rpx',
          height: window.$screenHeight - 88 - window.$statusBarHeight + 'rpx'
        }}
      >
        <SysNavBar title='发表评论' />
        <AtToast isOpened={showToast} {...toast}></AtToast>
        <View className='evaluate-header'>
          {private_consume && !!private_consume.id ? (
            <View className='evaluate-header-normal'>
              <Image
                className='evaluate-header-image'
                src={private_consume.images.split(',')[0]}
              />
              <View className='evaluate-header-right'>
                <View className='evaluate-header-title'>
                  {private_consume.name}
                </View>
                <View className='evaluate-header-subtitle'>
                  {scene === 'BANSHOU_PRIVATE'
                    ? `下单时间:${dayjs(create_time).format('YYYY-MM-DD')}`
                    : `用车时间:${dayjs(start_time).format('YYYY-MM-DD')}`}
                </View>
                <View className='evaluate-header-subtitle'>
                  {scene === 'BANSHOU_PRIVATE'
                    ? `数量: x${count || 0}`
                    : `车型: ${chexing.name}${zuowei.name}`}
                </View>
                <View className='evaluate-header-subtitle'></View>
              </View>
            </View>
          ) : (
            <View className='evaluate-header-ex'>
              <View className='evaluate-header-ex-price'>
                ￥{returnFloat(price)}
              </View>
              <View className='evaluate-header-ex-title'>
                {chexing.name || ''}
                {zuowei.name || ''}
              </View>
              <View className='evaluate-header-ex-place'>
                <View className='evaluate-header-ex-place-start'>
                  {start_place || '无'}
                </View>
                <View className='evaluate-header-ex-place-target'>
                  {target_place || '无'}
                </View>
              </View>
            </View>
          )}
        </View>
        <View className='evaluate-rate'>
          <View className='evaluate-rate-label'>服务评分</View>
          <AtRate value={rate} max={5} margin={26} onChange={this.handleRate} />
        </View>
        <View className='evaluate-content'>
          <AtTextarea
            value={content}
            maxLength={100}
            onChange={this.handleContent}
            placeholder='我们的服务满足你的期待吗？说说你的体验心得，分享给想要买的他们吧'
          />
        </View>
        <View className='evaluate-images'>
          <AtImagePicker
            files={images}
            showAddBtn={images.length < 1}
            onChange={this.handleImages}
          />
        </View>
        <View className='evaluate-footer' onClick={this.handleEvaluate}>
          立即评价
        </View>
      </View>
    )
  }
}

export default Evaluate
