import Taro, { Component } from '@tarojs/taro'
import { View, Input, Label, ScrollView, SwiperItem } from '@tarojs/components'
import NavBar from '../../components/NavBar'
import { connect } from '@tarojs/redux'
import '../common/index.scss'
import './index.scss'

import daySchedulePng from '../../asset/images/day_schedule.png'
import { AtDivider, AtNavBar, AtInputNumber, AtSwitch, AtInput } from 'taro-ui'
import CommentItem from '../../components/CommentItem'
import SysNavBar from '../../components/SysNavBar'
import { returnFloat } from '../../utils/tool'

@connect(({ system }) => ({
  info: system.info
}))
class SaveAddress extends Component {
  config = {}

  state = {
    id: '',
    name: '',
    phone: '',
    address: '',
    isDefault: false
  }

  componentWillMount() {}

  handleSave = e => {
    e.stopPropagation()
    console.log('handleSave')
    Taro.navigateBack()
  }

  handleDelete = e => {
    e.stopPropagation()
    console.log('handleDelete')
    Taro.navigateBack()
  }

  handleInput = (item, value) => {
    console.log(item, value)
    if (item.name === '姓名') {
      this.setState({
        name: value
      })
    } else if (item.name === '电话') {
      this.setState({
        phone: value
      })
    } else {
      this.setState({
        address: value
      })
    }
  }

  handleSwitch = value => {
    this.setState({
      isDefault: value
    })
  }

  render() {
    const { id, name, phone, address, isDefault } = this.state
    const formItems = [
      {
        name: '姓名',
        value: name,
        placeholder: '请输入您的姓名'
      },
      {
        name: '电话',
        value: phone,
        placeholder: '请输入您的联系电话'
      },
      {
        name: '地址',
        value: address,
        placeholder: '请输入您的详细地址'
      }
    ]
    return (
      <View className='save-address-page'>
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
            checked={isDefault}
            onChange={this.handleSwitch}
          />
        </View>
        <View className='save-address' onClick={this.handleSave}>保存</View>
        {!id && <View className='delete-address' onClick={this.handleDelete}>删除收货地址</View>}
      </View>
    )
  }
}

export default SaveAddress
