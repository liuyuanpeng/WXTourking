import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  Button,
  Label,
  Input,
  Image,
} from '@tarojs/components'
import {
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtTextarea,
  AtImagePicker,
  AtInput,
  AtIcon,
  AtProgress,
} from 'taro-ui'
import '../../common/index.scss'
import SysNavBar from '@components/SysNavBar'
import OrderItem from '@components/OrderItem'
import LocationInput from '@components/LocationInput'
import './index.scss'
import styles from './index.module.scss'
import STORAGE from '../../constants/storage'
import { debounce } from 'debounce'

let RESULTS = []

@connect(({ }) => ({}))
class Publish extends Component {
  config = {
    navigationBarTitleText: '投稿',
  }

  state = {
    name: '',
    content: '',
    images: [],
    category: 'JINGDIAN',
    location: { title: '' },
    file: '',
    progress: 0,
    cover: '',
    status: '',
  }

  handleLocationChange = (location) => {
    this.setState({
      location,
    })
  }

  handleNameChange = (name) => {
    this.setState({
      name,
    })
  }

  handleContentChange = (content) => {
    this.setState({
      content,
    })
  }

  handleImages = (files) => {
    this.setState({
      images: files,
    })
  }

  handleCover = (files) => {
    if (files && files.length === 1) {
      this.setState({
        cover: files[0]
      })
    }
    else {
      this.setState({
        cover: ''
      })
    }
  }

  categories = [
    {
      name: '# 景点',
      value: 'JINGDIAN',
    },
    {
      name: '# 美食',
      value: 'MEISHI',
    },
    {
      name: '# 视频',
      value: 'SHIPIN',
    },
    {
      name: '# 攻略',
      value: 'GONGLUE',
    },
  ]

  handleCategoryChange = (category, e) => {
    e.stopPropagation()
    this.setState({
      category,
    })
  }

  saveDiscovery = (payload) => {
    const { dispatch } = this.props
    dispatch({
      type: 'discovery/saveDiscovery',
      payload,
      success: () => {
        Taro.navigateBack()
        Taro.showToast({
          title: '投稿成功，请等待审核',
          icon: 'none',
        })
      },
      fail: (msg) => {
        Taro.showToast({
          title: msg || '投稿失败',
          icon: 'none',
        })
      },
    })
  }

  uploadImages(images, callback) {
    let IMAGES = images.concat()
    const image = IMAGES.shift()
    if (!image) {
      callback && callback()
    }
    Taro.uploadFile({
      url: HOST + '/v5/file/local/qiniu_wechat_upload?file_key=file',
      filePath: image.file.path,
      name: 'file',
      header: {
        token: Taro.getStorageSync(STORAGE.TOKEN),
      },
      success: (res) => {
        const DATA = JSON.parse(res.data)
        if (DATA.code === 'SUCCESS') {
          RESULTS.push(DATA.data.path)
          this.uploadImages(IMAGES, callback)
        }
      },
    })
  }

  handlePublish = (e) => {
    e.stopPropagation()

    const {
      name,
      content,
      images,
      cover,
      status,
      file,
      category,
      location,
    } = this.state

    // 判断合法性
    let msg = ''
    if (!name) {
      msg = '请输入标题'
    } else if (!content) {
      msg = '请输入您的分享内容'
    } else if (!category) {
      msg = '请选择分类'
    } else if (!location.latitude || !location.longitude) {
      msg = '请选择您的位置'
    } else if (category === 'SHIPIN' && !file) {
      msg = '请选择视频文件上传'
    } else if (category === 'SHIPIN' && !cover) {
      msg = '请为视频设置一个封面'
    } else if (
      category === 'SHIPIN' &&
      (status === 'progress' || status === 'error')
    ) {
      msg = '请等待视频文件上传成功'
    }
    if (msg) {
      Taro.showToast({
        title: msg,
        icon: 'none',
      })
      return
    }

    const { title, longitude, latitude } = location

    const payload = {
      name,
      content,
      faxian_category: category,
      target_place: title,
      target_longitude: longitude,
      target_latitude: latitude,
      images: '',
    }
    if (category !== 'SHIPIN') {
      if (images && images.length) {
        RESULTS = []
        Taro.showLoading({
          title: '上传图片...',
        })

        this.uploadImages(images, () => {
          Taro.hideLoading()
          // 上传成功,创建表单
          payload.images = RESULTS.toString()
          this.saveDiscovery(payload)
        })
      } else {
        this.saveDiscovery(payload)
      }
      return
    }
    if (category === 'SHIPIN' && status === 'success') {
      // 上传封面
      Taro.showLoading({ title: '上传封面...' })
      Taro.uploadFile({
        url: HOST + '/v5/file/local/qiniu_wechat_upload?file_key=file',
        filePath: cover.file.path,
        name: 'file',
        header: {
          token: Taro.getStorageSync(STORAGE.TOKEN),
        },
        success: (res) => {
          Taro.hideLoading()
          const DATA = JSON.parse(res.data)
          // 上传成功,创建表单
          payload.images = file + ',' + DATA.data.path // 格式: 视频地址+封面地址
          this.saveDiscovery(payload)
        },
        fail: () => {
          Taro.hideLoading()
        }
      })
    }
  }

  handleVideoUpload = (e) => {
    e.stopPropagation()
    Taro.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        if (res.size >= 10 * 1024 * 1024) {
          Taro.showToast({
            title: '视频大小不能大于10M',
            icon: 'none',
          })
          return
        }
        this.setState({
          file: res.tempFilePath,
          status: 'progress',
        })
        // 上传文件
        this.uploadTask = Taro.uploadFile({
          url: HOST + '/v5/file/local/qiniu_wechat_upload?file_key=file',
          filePath: res.tempFilePath,
          name: 'file',
          header: {
            token: Taro.getStorageSync(STORAGE.TOKEN),
          },
          success: (result) => {
            const DATA = JSON.parse(result.data)
            if (DATA.code === 'SUCCESS') {
              this.setState({
                file: DATA.data.path,
                status: 'success',
              })
            }
          },
          fail: () => {
            this.setState({
              status: 'error',
            })
          },
        })
        this.uploadTask.progress((uploadRes) => {
          this.setState({
            progress: uploadRes.progress,
          })
        })
      },
    })
  }

  render() {
    const scrollStyle = {
      height: `${window.$screenHeight - window.$statusBarHeight - 88}rpx`,
    }

    const {
      name,
      content,
      images,
      file,
      cover,
      category,
      location,
      progress,
      status,
    } = this.state

    return (
      <View
        className='publish-page'
        style={{ top: 88 + window.$statusBarHeight + 'rpx' }}
      >
        <SysNavBar title='投稿' />
        <ScrollView className='publish' scrollY style={scrollStyle}>
          <AtInput
            className='publish-input'
            name='publish-input-name'
            value={name}
            onChange={this.handleNameChange}
            type='text'
            placeholder='添加标题更容易被推荐哦'
          />
          <View className='publish-split-line' />
          <AtTextarea
            className='publish-textarea'
            value={content}
            count={false}
            onChange={this.handleContentChange}
            maxLength={200}
            height={300}
            placeholder='请详细写下您的分享，越详细越容易被推荐哦～'
          />
          <View className='publish-tip'>
            写100个字，有机会评为
            <Label className='publish-tip-yellow'>精选</Label>
          </View>
          {category !== 'SHIPIN' && (
            <View className='publish-images'>
              <AtImagePicker
                files={images}
                showAddBtn={images.length < 4}
                onChange={this.handleImages}
              />
            </View>
          )}
          {!file && category === 'SHIPIN' && (
            <View
              className='publish-upload-btn'
              onClick={this.handleVideoUpload}
            >
              上传视频
            </View>
          )}
          {file && category === 'SHIPIN' && (
            <View className='publish-video'>
              <View className='publish-video-label'>封面:</View>
              <AtImagePicker
                files={cover ? [cover] : []}
                count={1}
                multiple={false}
                showAddBtn={!cover}
                onChange={this.handleCover}
              />
              <View className='publish-video-label'>
                {status === 'progress'
                  ? progress === 100
                    ? '文件写入，请耐心等待...'
                    : '文件上传...'
                  : status === 'success'
                    ? '上传成功'
                    : '上传失败'}
              </View>
              <AtProgress percent={progress} status={status} />
            </View>
          )}
          <View className='publish-split' />
          <View className='publish-location'>
            <AtIcon value='map-pin' size='16' color='#333333'></AtIcon>
            <Label className='publish-location-label'>你在哪里</Label>
            <LocationInput
              externalClass={styles.publishLocationInput}
              title={location.title}
              placeholder='(必填，越详细越容易被推荐)'
              onChange={this.handleLocationChange}
            />
          </View>

          <View className='publish-split' />

          <View className='publish-category'>
            <View className='publish-category-header'>
              <View className='publish-category-header-subtitle'>
                选择合适的分类会被更多人看到
              </View>
              <View className='publish-category-header-title'>
                <Label className='publish-category-header-title-bold'>#</Label>
                添加到分类
              </View>
            </View>
            <View className='publish-category-list'>
              {this.categories.map((item) => (
                <View
                  key={item.value}
                  onClick={this.handleCategoryChange.bind(this, item.value)}
                  className={`publish-category-item${item.value === category
                    ? ' publish-category-item-selected'
                    : ''
                    }`}
                >
                  {item.name}
                </View>
              ))}
            </View>
          </View>
          <View
            className='publish-btn'
            onClick={debounce(this.handlePublish, 100)}
          >
            立即发布
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Publish
