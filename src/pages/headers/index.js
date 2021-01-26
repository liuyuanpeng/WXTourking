import Taro, { Component } from '@tarojs/taro'
import { View, Image, Label, ScrollView, SwiperItem } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import { debounce } from 'debounce'

@connect(({ header }) => ({
  data: header.list,
  defaultHeader: header.defaultHeader
}))
class Headers extends Component {
  config = {
  }

  state = {}

  componentWillMount() {
    if (this.$router.params.mode === 'select') {
      this.selectMode = true
    }
    this.getData()
  }

  getData() {
    const {dispatch} = this.props
    dispatch({
      type: 'header/getUserBillHeader'
    })
  }

  onSelect = (data, e) => {
    e.stopPropagation()
    if (this.selectMode) {
      const pages = Taro.getCurrentPages()
      const prePage = pages[pages.length - 2]
      prePage.setData({
        header: data
      })
      Taro.navigateBack()
    }
  }

  handleEdit = (item, e) => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../billHead/index',
      success: res=>{
        res.eventChannel.emit('headerData', {
          ...item
        })
      }
    })
  }

  handleNew = e => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '../billHead/index'
    })
  }

  render() {
    const {data} = this.props
    return (
      <View className='headers-page' style={{top: 88 + Taro.$statusBarHeight + 'rpx'}}>
        <SysNavBar title='发票抬头' />
        {data.map((item, index) => (
          <View className='address-item' key={`address-item-${index}`} onClick={this.onSelect.bind(this, item)}>
            <View className='address-left'>
              <Label className='address-name'>{item.name}</Label>
              <View className='address-address'>{item.num}</View>
            </View>
            <View
              className='address-right'
              onClick={this.handleEdit.bind(this, item)}
            >
              编辑
            </View>
          </View>
        ))}
        <View className='address-new' onClick={debounce(this.handleNew, 100)}>新增发票抬头</View>
      </View>
    )
  }
}

export default Headers
