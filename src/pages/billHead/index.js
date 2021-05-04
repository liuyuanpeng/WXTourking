import Taro from '@tarojs/taro'
import React, { Component } from 'react'
import {
  View,
  Image,
  Label,
  Swiper,
  ScrollView,
  Input,
} from '@tarojs/components'
import NavBar from '@components/NavBar'
import { connect } from 'react-redux'
// import '../../common/index.scss'
import './index.scss'
import styles from './index.module.scss'

import {
  AtCheckbox,
  AtNavBar,
  AtInputNumber,
  AtTabs,
  AtTabsPane,
  AtInput,
  AtSwitch,
} from 'taro-ui'
import CommentItem from '@components/CommentItem'
import SysNavBar from '@components/SysNavBar'
import { returnFloat } from '@utils/tool'
import BillItem from '@components/BillItem'
import CheckBox from '@components/CheckBox'

@connect(({ header }) => ({
  data: header.list,
  defaultHeader: header.defaultHeader,
}))
class BillHead extends Component {
  config = {
    navigationBarTitleText: '开具发票',
  }

  state = {
    id: '',
    name: '',
    type: 1,
    num: '',
    address: '',
    telphone: '',
    bank: '',
    card: '',
    set_default: false,
  }

  componentDidMount() {
    const eventChannel = Taro.getCurrentInstance().page.getOpenerEventChannel()
    eventChannel.on('headerData', (data) => {
      this.setState({
        ...data,
      })
    })

    const { data } = this.props
    if (!data || data.length <= 1) {
      this.setState({
        set_default: true,
      })
    }
  }

  handleCheck = (isCompony) => {
    this.setState({
      type: isCompony ? 1 : 0,
    })
  }
  handleChange = (key, value) => {
    const newState = {}
    newState[key] = value
    this.setState(newState)
  }

  handleSave = (e) => {
    e.stopPropagation()
    const { dispatch } = this.props
    const {
      id,
      name,
      type,
      num = '',
      address = '',
      telphone = '',
      bank = '',
      card = '',
      set_default,
    } = this.state
    let msg = ''
    if (!name) {
      msg = type ? '请输入公司名称' : '请输入抬头名称'
    } else if (type && !num) {
      msg = '请输入税务登记账号'
    }
    if (msg) {
      Taro.showToast({
        title: msg,
        icon: 'none',
      })
      return
    }
    const payload = {
      name,
      type,
      num,
      telphone,
      bank,
      card,
      address,
      set_default,
    }
    if (id) {
      payload.id = id
    }
    dispatch({
      type: 'header/saveUserBillHeader',
      payload,
      success: () => {
        Taro.showToast({
          title: '成功保存发票抬头',
          icon: 'none',
        })
        Taro.navigateBack()
      },
      fail: (message) => {
        Taro.showToast({
          title: message || '发票抬头保存失败',
        })
      },
    })
  }

  handleDelete = (e) => {
    e.stopPropagation()
    const { dispatch } = this.props
    const { id } = this.state
    if (id) {
      dispatch({
        type: 'header/deleteUserBillHeader',
        payload: {
          id,
        },
        success: () => {
          Taro.navigateBack()
        },
        fail: (msg) => {
          Taro.showToast({
            title: msg || '删除发票抬头失败',
            icon: 'none',
          })
        },
      })
    }
  }

  handleSwitch = (value) => {
    this.setState({
      set_default: value,
    })
  }

  render() {
    const {
      id,
      type,
      name,
      num,
      address,
      bank,
      card,
      telphone,
      set_default,
    } = this.state
    const { data } = this.props
    let bFirst = false
    if (!data || data.length === 0) {
      bFirst = true
    }

    const ITEMS = [
      {
        name: 'num',
        label: '税务登记账号',
        required: true,
        value: num
      },
      {
        name: 'address',
        label: '注册场所地址',
        value: address
      },
      {
        name: 'telphone',
        label: '注册场所电话',
        value: telphone
      },
      {
        name: 'bank',
        label: '开户银行',
        value: bank
      },
      {
        name: 'card',
        label: '基本开户账号',
        value: card
      }
    ]

    return (
      <View
        className='bill-head'
        style={{
          top: 88 + window.$statusBarHeight + 'rpx',
          height: window.$screenHeight - 88 - window.$statusBarHeight + 'rpx',
        }}
      >
        <SysNavBar title='发票抬头' />
        <View className='bill-head-item'>
          <View className='bill-head-item-split' />
          <View className='bill-head-item-label-required'>抬头类型</View>
          <View className='bill-head-item-content'>
            <CheckBox
              wrapClass={styles.billHeadItemContentCheck}
              checked={type === 1}
              onChange={this.handleCheck.bind(this, true)}
              title='企业'
            />
            <CheckBox
              wrapClass={styles.billHeadItemContentCheck}
              checked={type === 0}
              onChange={this.handleCheck.bind(this, false)}
              title='个人/非企业'
            />
          </View>
        </View>
        <View className='bill-head-item'>
          <View className='bill-head-item-split' />
          <View className='bill-head-item-label-required'>
            {type ? '公司名称' : '抬头名称'}
          </View>
          <View className='bill-head-item-content'>
            <AtInput
              type='text'
              value={name}
              name='bill-header-input-name'
              placeholder={`请输入${type ? '公司名称' : '抬头名称'}(必填)`}
              className='bill-head-item-content-input'
              onChange={this.handleChange.bind(this, 'name')}
            />
          </View>
        </View>
        {!!type &&
          ITEMS.map(item => (
            <View className='bill-head-item' key={item.name}>
              <View className='bill-head-item-split' />
              <View
                className={`bill-head-item-label${
                  item.required ? '-required' : ''
                }`}
              >
                {item.label}
              </View>
              <View className='bill-head-item-content'>
                <AtInput
                  type='text'
                  name={`bill-header-input-${item.name}`}
                  value={item.value}
                  placeholder={`请输入${item.label}${
                    item.required ? '(必填)' : ''
                  }`}
                  className='bill-head-item-content-input'
                  onChange={this.handleChange.bind(this, item.name)}
                />
              </View>
            </View>
          ))}

        <View className='form-item'>
          <Label className='label-name-ex'>设为默认</Label>
          <AtSwitch
            className='custom-switch form-switch'
            color='#fed101'
            checked={set_default}
            disabled={bFirst}
            onChange={this.handleSwitch}
          />
        </View>

        <View className='save-bill-head' onClick={this.handleSave}>
          保存
        </View>
        {true && (
          <View className='delete-bill-head' onClick={this.handleDelete}>
            删除发票抬头
          </View>
        )}
      </View>
    )
  }
}

export default BillHead
