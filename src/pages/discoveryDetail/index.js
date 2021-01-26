import Taro, { Component } from '@tarojs/taro'
import {
  View,
  Image,
  Label,
  Swiper,
  SwiperItem,
  Text,
  Video,
  Input
} from '@tarojs/components'
import SysNavBar from '@components/SysNavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtInput, AtTabs } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import PopView from '@components/PopView'
import dayjs from 'dayjs'
import STORAGE from '../../constants/storage'

@connect(({ discovery }) => ({
  comments: discovery.listComment
}))
class DiscoveryDetail extends Component {
  config = {}

  state = {
    detail: {},
    inputValue: '',
    visible: false
  }

  componentDidMount() {
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('discoveryData', detail => {
      this.setState({
        detail
      })
      // 获取评论
      const { id } = detail
      if (id) {
        this.props.dispatch({
          type: 'discovery/getDiscoveryCommentList',
          payload: {
            find_id: id,
            valid: false
          },
          fail: msg => {
            Taro.showToast({
              title: msg || '获取评论失败',
              icon: 'none'
            })
          }
        })
      }
    })
  }

  seeAll = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../comments/index'
    })
  }

  changeLike = e => {
    e.stopPropagation()
    const { detail } = this.state
    const { find_zan_id, faxian_category, id, zan_count = 0 } = detail
    if (find_zan_id) {
      // 取消点赞
      this.props.dispatch({
        type: 'discovery/unlikeDiscovery',
        payload: {
          id: find_zan_id
        },
        success: () => {
          this.setState({
            detail: {
              ...detail,
              find_zan_id: null,
              zan_count: zan_count - 1
            }
          })
        }
      })
    } else {
      // 点赞
      this.props.dispatch({
        type: 'discovery/likeDiscovery',
        payload: {
          find_id: id,
          faxian_category,
          user_id: Taro.getStorageSync(STORAGE.USER_ID)
        },
        success: res => {
          this.setState({
            detail: {
              ...detail,
              find_zan_id: res.id,
              zan_count: zan_count + 1
            }
          })
        }
      })
    }
  }

  changeFavor = e => {
    e.stopPropagation()
    const { detail } = this.state
    const { find_collect_id, id, faxian_category, collect_count = 0 } = detail
    if (find_collect_id) {
      // 取消收藏
      this.props.dispatch({
        type: 'discovery/unfavorDiscovery',
        payload: {
          id: find_collect_id
        },
        success: () => {
          this.setState({
            detail: {
              ...detail,
              find_collect_id: null,
              collect_count: collect_count - 1
            }
          })
        }
      })
    } else {
      // 收藏
      this.props.dispatch({
        type: 'discovery/favorDiscovery',
        payload: {
          find_id: id,
          faxian_category,
          user_id: Taro.getStorageSync(STORAGE.USER_ID)
        },
        success: res => {
          this.setState({
            detail: {
              ...detail,
              find_collect_id: res.id,
              collect_count: collect_count + 1
            }
          })
        }
      })
    }
  }

  changeInputValue = inputValue => {
    this.setState({
      inputValue
    })
    return inputValue
  }

  handleComment = inputValue => {
    const { detail } = this.state
    const { id, faxian_category } = detail
    if (inputValue.trim()) {
      //发布评论
      Taro.showLoading({ title: '发布评论...' })
      this.props.dispatch({
        type: 'discovery/commentDiscovery',
        payload: {
          content: inputValue.trim(),
          faxian_category,
          find_id: id,
          user_id: Taro.getStorageSync(STORAGE.USER_ID)
        },
        success: () => {
          Taro.hideLoading()

          Taro.showToast({
            title: '发布成功，请等待审核',
            icon: 'none'
          })

          this.setState({
            inputValue: ''
          })
        }
      })
    }
  }
  showAllComments = (visible = true) => {
    this.setState({
      visible
    })
  }

  render() {
    const { comments } = this.props
    const { detail, inputValue, visible } = this.state
    const {
      images,
      name,
      content,
      create_time,
      target_place,
      faxian_category = 'JINGDIAN',
      zan_count = 0,
      evaluate_count = 0,
      collect_count = 0,
      find_zan_id,
      find_collect_id
    } = detail
    let banners
    try {
      banners = images ? images.split(',') : []
    } catch (error) {
      return <View></View>
    }

    let commentList = []
    if (comments && comments.length > 3) {
      commentList = comments.slice(0, 3)
    } else {
      commentList = comments
    }

    return (
      <View className='discovery-detail'>
        <SysNavBar transparent />
        <View className='discovery-detail-banner'>
          {faxian_category !== 'SHIPIN' && (
            <Swiper autoplay className='discovery-detail-images'>
              {banners.map((image, INDEX) => (
                <SwiperItem key={`discovery-detail-images-${INDEX}`}>
                  <Image
                    className='discovery-detail-images-item'
                    src={image}
                    mode='aspectFill'
                  />
                </SwiperItem>
              ))}
            </Swiper>
          )}
          {faxian_category === 'SHIPIN' && (
            <View className='discovery-detail-video'>
              <Video
                className='discovery-detail-video-item'
                controls='controls'
                src={banners[0]}
              />
            </View>
          )}
        </View>
        <View className='discovery-detail-header'>
          <View className='discovery-detail-header-title'>{name}</View>
          <View className='discovery-detail-header-subtitle'>
            <View className='discovery-detail-header-subtitle-icon' />
            {target_place}
          </View>
          <View className='discovery-detail-header-time'>
            发布于{dayjs(create_time).format('YYYY-MM-DD HH:mm')}
          </View>
        </View>
        <View className='discovery-detail-content'>{content}</View>
        <View className='discovery-detail-split' />
        <View className='discovery-detail-comments'>
          <View className='discovery-detail-comments-header'>
            评论({comments ? comments.length : 0})
          </View>
          {commentList.map(comment => (
            <CommentItem
              key={comment.id}
              name={
                comment.user.nick_name || comment.user.name || comment.user.id
              }
              avatar={comment.user.avatar || ''}
              time={comment.create_time}
              comment={comment.content}
            />
          ))}
          {comments && comments.length > 3 && (
            <View
              className='discovery-detail-comments-more'
              onClick={this.showAllComments.bind(this, true)}
            >
              展开更多评论
            </View>
          )}
        </View>
        {/* <View className='discovery-detail-split' /> */}
        <View className='discovery-detail-footer'>
          <View className='discovery-detail-footer-comment'>
            <AtInput
              className='discovery-detail-footer-comment-input'
              placeholder='写个评论吧...'
              value={inputValue}
              onChange={this.changeInputValue}
              confirmType='send'
              adjustPosition
              onConfirm={this.handleComment}
            />
          </View>
          <View className='discovery-detail-footer-operations'>
            <View
              className='discovery-detail-footer-operations-item'
              onClick={this.changeLike}
            >
              <View
                className={`discovery-detail-footer-operations-item-icon-like${
                  find_zan_id
                    ? ' discovery-detail-footer-operations-item-icon-like-active'
                    : ''
                }`}
              />
              <View className='discovery-detail-footer-operations-item-text'>
                {zan_count}
              </View>
            </View>
            <View className='discovery-detail-footer-operations-item'>
              <View className='discovery-detail-footer-operations-item-icon-comment' />
              <View className='discovery-detail-footer-operations-item-text'>
                {evaluate_count}
              </View>
            </View>
            <View
              className='discovery-detail-footer-operations-item'
              onClick={this.changeFavor}
            >
              <View
                className={`discovery-detail-footer-operations-item-icon-favor${
                  find_collect_id
                    ? ' discovery-detail-footer-operations-item-icon-favor-active'
                    : ''
                }`}
              />
              <View className='discovery-detail-footer-operations-item-text'>
                {collect_count}
              </View>
            </View>
          </View>
        </View>
        <PopView
          title={`共${comments.length}条评论`}
          visible={visible}
          onClose={this.showAllComments.bind(this, false)}
        >
          <View className='pop-container'>
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                name={
                  comment.user.nick_name || comment.user.name || comment.user.id
                }
                avatar={comment.user.avatar || ''}
                time={comment.create_time}
                comment={comment.content}
              />
            ))}
          </View>
        </PopView>
      </View>
    )
  }
}

export default DiscoveryDetail
