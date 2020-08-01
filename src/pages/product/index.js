import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, Swiper, SwiperItem } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

const daySchedulePng = IMAGE_HOST + '/images/bkg4.png'
import { AtDivider } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'


class ProductDetail extends Component {
  config = {}

  state = {
    type: 'scene' // scene, food, gift
  }

  componentWillMount() {
    this.setState({
      type: this.$router.params.type || 'scene'
    })
  }

  seeAll = e => {
    e.stopPropagation()
    console.log('see all')
  }

  onSubmit = e => {
    e.stopPropagation()
    console.log('onSubmit')
    const {type} = this.state
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

  render() {
    const { type } = this.state
    const detail = {
      banner: daySchedulePng,
      title: '厦门胡里山炮台',
      subtitle: '八闽门户，天南锁钥',
      location: '福建省厦门市思明区',
      price: 24,
      reason:
        '推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由推荐理由',
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
      detail:
        '景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍景点介绍',
      detailBanners: [daySchedulePng, daySchedulePng, daySchedulePng]
    }

    const comment = detail.comments[0]

    return (
      <View className='product-detail'>
        <SysNavBar transparent noBorder />
        <Image className='home-png' src={detail.banner} mode='widthFix' />
        <View className='product-container'>
          <View className='product-title'>
            {detail.title}
            {type === 'gift' && (
              <View className='price'>{`￥${detail.price}`}</View>
            )}
          </View>

          <View className='subtitle'>{detail.subtitle}</View>
          <AtDivider lineColor='#F3F3F3' />
          <View className='location-icon' />
            <Label className='location-text'>{detail.location}</Label>
          <AtDivider lineColor='#F3F3F3' />
          <View className='reason-title'>推荐理由</View>
          <View className='reason'>{detail.reason}</View>
          <View className='comments-title'>
            {`达人点评（${detail.comments.length}）`}
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
            {type === 'scene' ? '景点' : type === 'food' ? '美食' : '伴手礼'}
            介绍
          </View>
          <View className='detail-container'>
            {detail.detailBanners && detail.detailBanners.length && (
              <Swiper autoplay className='detail-swiper'>
                {detail.detailBanners.map((item, index) => (
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
            <View className='detail-desc'>{detail.detail}</View>
          </View>
          <View className='i-want-it' onClick={this.onSubmit}>
            我想{type === 'gift' ? '要' : '去'}
          </View>
        </View>
      </View>
    )
  }
}

export default ProductDetail
