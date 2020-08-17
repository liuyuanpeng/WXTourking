import Taro, { Component } from '@tarojs/taro'
import { View, Input, Label, ScrollView, SwiperItem } from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from '@tarojs/redux'
import '../../common/index.scss'
import './index.scss'

import { AtDivider, AtNavBar, AtInputNumber, AtSwitch, AtInput } from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'

@connect(({ address }) => ({
  data: address.list,
  defaultAddress: address.defaultAddress
}))
class SaveAddress extends Component {
  config = {}

  state = {
    id: '',
    name: '',
    mobile: '',
    address: '',
    set_default: false
  }

  componentDidMount() {
    const eventChannel = this.$scope.getOpenerEventChannel()
    eventChannel.on('addressData', data => {
      this.setState({
        ...data
      })
    })

    const {data} = this.props
    if (!data || data.length === 0) {
      this.setState({
        set_default: true
      })
    }
  }

  handleSave = e => {
    e.stopPropagation()
    const {dispatch} = this.props
    const {id, name, mobile, address, set_default} = this.state
    let msg = ''
    const regex = /^(13|14|15|16|17|18|19)\d{9}$/
    if (!name) {
      msg = '请输入您的姓名'
    } else if (!mobile || !regex.test(mobile)) {
      msg = '请输入正确的联系电话'
    } else if (!address) {
      msg = '请输入您的详细地址'
    }
    if (msg) {
      Taro.showToast({
        title: msg,
        icon: 'none'
      })
      return
    }
    const payload = {
      name,
      mobile,
      address,
      set_default
    }
    if (id) {payload.id = id}
    dispatch({
      type: 'address/saveUserAddress',
      payload,
      success: () => {
        Taro.showToast({
          title: '成功保存地址',
          icon: 'none'
        })
        Taro.navigateBack()
      },
      fail: message => {
        Taro.showToast({
          title: message || '地址保存失败'
        })
      }
    })
  }

  handleDelete = e => {
    e.stopPropagation()
    const {dispatch} = this.props
    const {id} = this.state
    if (id) {
      dispatch({
        type: 'address/deleteUserAddress',
        payload: {
          id
        },
        success: () => {
          Taro.navigateBack()
        },
        fail: msg => {
          Taro.showToast({
            title: msg || '删除地址失败',
            icon: 'none'
          })
        }
      })
    }
  }

  handleInput = (item, value) => {
    if (item.name === '姓名') {
      this.setState({
        name: value
      })
    } else if (item.name === '电话') {
      this.setState({
        mobile: value
      })
    } else {
      this.setState({
        address: value
      })
    }
  }

  handleSwitch = value => {
    this.setState({
      set_default: value
    })
  }

  render() {
    const { id, name, mobile, address, set_default } = this.state
    const formItems = [
      {
        name: '姓名',
        value: name,
        placeholder: '请输入您的姓名'
      },
      {
        name: '电话',
        value: mobile,
        placeholder: '请输入您的联系电话'
      },
      {
        name: '地址',
        value: address,
        placeholder: '请输入您的详细地址'
      }
    ]
    const {data} = this.props
    let bFirst = false
    if (!data || data.length === 0) {
      bFirst = true
    }
    return (
      <View className='save-address-page' style={{ top: 88 + Taro.$statusBarHeight + 'rpx' }}>
        <SysNavBar title={`${id ? '编辑' : '新增'}收货地址`} />
        {formItems.map((item, index) => (
          <View className='form-item' key={`form-item-${index}`}>
            <Label className='label-name'>{item.name}</Label>
            <AtInput
              className='form-input'
              value={item.value}
              placeholder={item.placeholder}
              onChange={this.handleInput.bind(this, item)}
            />
          </View>
        ))}
        <View className='form-item'>
          <Label className='label-name-ex'>设为默认地址</Label>
          <AtSwitch
            className='custom-switch form-switch'
            color='#fed101'
            checked={set_default}
            disabled={bFirst}
            onChange={this.handleSwitch}
          />
        </View>
        <View className='save-address' onClick={this.handleSave}>保存</View>
        {id && <View className='delete-address' onClick={this.handleDelete}>删除收货地址</View>}
      </View>
    )
  }
}

export default SaveAddress
