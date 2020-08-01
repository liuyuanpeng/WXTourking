import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import './index.scss'

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

@connect(({city}) => ({
  cityList: city.list,
  currentCity: city.current
}))
class Navbar extends Taro.Component {
  static defaultProps = {
    opacity: 0,
    title: '旅王出行',
    showSearch: true,
    showBack: false,
    showBackOnly: false,
    navigate: false,
    onFocus: null
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
    
    navigate && Taro.navigateTo({
      url: '../search/index'
    })
  }

  onActionClick = e => {
    const {navigate} = this.props
    e.stopPropagation()
    
    navigate && Taro.navigateTo({
      url: '../search/index'
    })
  }

  onBack = e => {
    e.stopPropagation()
    Taro.navigateBack()
  }

  render() {
    const {searchText} = this.state
    const { opacity, title, showSearch, showBack, showBackOnly, navigate, cityList, currentCity} = this.props

    if (showBackOnly) {
      return (
        <View className='back-btn' onClick={this.onBack} />
      )
    }
    return (
      <View className='bar' style={showSearch ? {height: Taro.$statusBarHeight+204+'rpx'} : { height:Taro.$statusBarHeight+134+'rpx'}}>
        <View className='back' style={{ opacity: opacity || 0 }} />
        {showBack && <View className='back-btn' style={{marginTop: Taro.$statusBarHeight + 32 + 'rpx'}} onClick={this.onBack} />}
        <View className='title' style={{marginTop: Taro.$statusBarHeight + 38 + 'rpx'}}>{title}</View>
        {showSearch && (
          <View className='search-bar'>
            <View className='location' onClick={this.onLocate}>
              {currentCity.name}
            </View>
            <View className='search'>
              <AtSearchBar
                customStyle={{backgroundColor: 'transparent', padding: 0}}
                inputType='text'
                placeholder='搜索景点、美食、伴手礼'
                value={searchText}
                onActionClick={this.onActionClick}
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
