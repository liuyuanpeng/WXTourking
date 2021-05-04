import Taro from '@tarojs/taro'
import React from 'react'
import { View } from '@tarojs/components'


import './index.scss'
import { debounce } from 'debounce'

class LocationInput extends React.Component {
  static defaultProps = {
    title: '',
    latitude: '',
    longitude: '',
    placeholder: '',
    onChange: null,
    externalClass: ''
  }

  handleClick=e=>{
    e.stopPropagation();
    Taro.navigateTo(
      {
        url: '../../pages/utilPages/location/index',
        events: {
          acceptLocation: location => {
            const {onChange} = this.props
            onChange && onChange(location)
          }
        }
      }
    )
  }

  render() {
    const { title, placeholder, externalClass } = this.props
    return (
      <View className={externalClass} onClick={debounce(this.handleClick, 100)}>
        <View className={`address ${title?'':'placeholder'}`}>{title || placeholder}</View>
      </View>
    )
  }
}
export default LocationInput
