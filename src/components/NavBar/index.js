import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'

import './index.less'

/**
 * static defaultProps = {
    opacity: 0,
    title: '旅王出行',
    showSearch: true,
    showBack: false,
    showBackOnly: false,
    navigate: false
  }

  height: 224px
 */
class Navbar extends Taro.Component {
  static defaultProps = {
    opacity: 0,
    title: '旅王出行',
    showSearch: true,
    showBack: false,
    showBackOnly: false,
    navigate: false
  }

  state = {
    searchText: ''
  }

  componentDidShow () {
    this.setState({
      searchText: ''
    })
  }

  handleChangeText = value => {
    const {navigate} = this.props
    if (navigate) {
      console.log('test')
      this.setState({
        searchText: ' '
      })
    } else {
      this.setState({
        searchText: value
      })
    }
  }
  onLocate = e => {
    const {navigate} = this.props
    e.stopPropagation()
    console.log('onLocate')
    
    navigate && Taro.navigateTo({
      url: '../search/index'
    })
  }
  onFocus = e => {
    const {navigate} = this.props
    e.stopPropagation()
    console.log('onFocus')
    navigate && Taro.navigateTo({
      url: '../search/index'
    })
  }

  onBack = e => {
    e.stopPropagation()
    console.log('onBack')
    Taro.navigateBack()
  }

  render() {
    const {searchText} = this.state
    const { opacity, title, showSearch, showBack, showBackOnly, navigate} = this.props

    if (showBackOnly) {
      return (
        <View className='back-btn' onClick={this.onBack} />
      )
    }
    return (
      <View className='bar' style={showSearch ? {} : { height: '80px' }}>
        <View className='back' style={{ opacity: opacity || 0 }} />
        {showBack && <View className='back-btn' onClick={this.onBack} />}
        <View className='title'>{title}</View>
        {showSearch && (
          <View className='search-bar'>
            <View className='location' onClick={this.onLocate}>
              厦门
            </View>
            <View className='weather'>多云 15°C</View>
            <View className='search'>
              <AtSearchBar
                customStyle={{backgroundColor: 'transparent', padding: 0}}
                inputType='text'
                placeholder='搜索景点、美食、伴手礼'
                value={searchText}
                onFocus={this.onFocus}
                focus={!navigate}
                onChange={this.handleChangeText}
              />
            </View>
          </View>
        )}
      </View>
    )
  }
}
export default Navbar

// 这里导航栏内容可以自行配置
