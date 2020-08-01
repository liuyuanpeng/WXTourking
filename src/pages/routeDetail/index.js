import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  Text
} from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../asset/common/index.scss'
import './index.scss'

import daySchedulePng from '@images/bkg4.png'
import { AtDivider, AtTabs } from 'taro-ui'
import CommentItem from '@components/CommentItem'


class ProductDetail extends Component {
  config = {}

  state = {
    current: 0,
    type: 'scene' // scene, food, gift
  }

  handleClick = current => {
    this.setState({
      current
    })
    const ids = ['detail', 'fee', 'notice']
    Taro.pageScrollTo({
      selector:`#${ids[current]}`
    })
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
    Taro.navigateTo({
      url: '../carType/index'
    })
  }

  render() {
    const { type } = this.state
    const detail = {
      banner:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
      title: '漳州南靖土楼一日游',
      subtitle: '网红景点 | 错峰玩法 | 深度玩法',
      location: '福建省漳州市南靖县书阳镇',
      price: 239,
      reason:
        '福建土楼被誉为“中国古建筑的奇葩”、 “东方文明的一颗璀，璨明珠”，已被列入《世界文化遗产名录》。南靖土楼作为福建土楼的杰出代表，在申报“世遗”中发挥着重要的作用。土楼群由1座方形、3座圆形和1座椭圆形共5座土楼组成,居中的方形步云楼和右，上方的圆形和昌楼建于清嘉庆元年(1796年)， 以后又在周边相继建起振昌楼、瑞云楼、文昌楼。五座土楼依山势错落布局，在群山环抱之中，居高俯瞰，像一朵盛开的梅花点缀在大地上，又像是飞碟从天而降，构成人文造艺与自然环境巧妙天成的绝景，令人叹为观止，是民居建筑百花园中的一朵奇葩。',
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
      detailBanners: [daySchedulePng, daySchedulePng, daySchedulePng],
      routes: [
        {
          title: '出发: 漳州市'
        },
        {
          title: '景点：抵达田螺坑土楼群'
        },
        {
          title: '景点：田螺坑土楼群',
          images: [
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'
          ],
          content:
            '午餐后乘车前往“世界文化遗产地-A线【田螺坑土楼群】位于南靖县西部的书洋上坂村田螺坑自然村，为黄氏家族聚居地。距南靖县城65公里 四座圆楼簇拥着一座方楼，像是一朵怒放的梅花，美妙绝伦、璀璨夺目，又像是一支气势磅礴的五重奏交响曲，在青山秀水间激越地奏响（上下观景台）世界上独一无二，土楼中的一张名片；'
        },
        {
          title: '景点：田螺坑土楼群',
          images: [
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592246709686&di=30081e07fdab9019b4aae97170c52194&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg'
          ],
          content:
            '继续乘车前行5公里，参观违反力学原理的东倒西歪楼【裕昌楼】，始建于元代中期，历经700多年风雨，目前楼内还有100多人居住。'
        }
      ],
      fee: [
        {
          title: '费用包含',
          content:
            '1. 用车费用：舒适5座车，每人一正坐\r\n\
          2. 门票费用：云水谣门票\r\n\
          3. 体验费用：土楼登楼费和茶山茶饮费'
        }
      ],
      notice: [
        {
          title: '成团承诺',
          content: '一人成团'
        },
        {
          title: '有效期',
          content: '有效期：2020-04-05至2020-06-30，周一至周日可使用'
        },
        {
          title: '购买须知',
          content: '需提前预约'
        },
        {
          title: '退订规则',
          content: '不可退订'
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

    const comment = detail.comments[0]

    return (
      <View className='product-detail'>
        <NavBar showBackOnly />
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
              {detail.routes &&
                detail.routes.map((item, index) => (
                  <View
                    className={`route-detail-item ${
                      index < detail.routes.length - 1
                        ? 'route-detail-item-border'
                        : ''
                    }`}
                    key={`route-detail-item-${index}`}
                  >
                    <View className='route-detail-item-title'>
                      {item.title}
                    </View>
                    {item.images && (
                      <Swiper autoplay className='route-detail-item-images'>
                        {item.images.map((image, INDEX) => (
                          <SwiperItem key={`route-detail-item-image-${INDEX}`}>
                            <Image
                              className='route-detail-item-image'
                              src={image}
                              mode='widthFix'
                            />
                          </SwiperItem>
                        ))}
                      </Swiper>
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
            {detail.fee &&
              detail.fee.map((item, index) => (
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
            {detail.notice &&
              detail.notice.map((item, index) => (
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
            ￥{detail.price}
            <Label className='footer-price-unit'>起</Label>
          </View>
          <View className='footer-btn' onClick={this.handleOK}>下一步</View>
        </View>
      </View>
    )
  }
}

export default ProductDetail
