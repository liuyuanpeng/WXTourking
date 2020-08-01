import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'


import './index.scss'

class LocationInput extends Taro.Component {
  static defaultProps = {
    title: '',
    latitude: '',
    longitude: '',
    placeholder: '',
    onChange: null
  }

  static externalClasses = ['wrap-class']

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
    const { title, placeholder } = this.props
    return (
      <View className='wrap-class' onClick={this.handleClick}>
        <View className={`address ${title?'':'placeholder'}`}>{title || placeholder}</View>
      </View>
    )
  }
}
export default LocationInput
