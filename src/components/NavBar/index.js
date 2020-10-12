import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import './index.scss'
import STORAGE from '../../constants/storage'
import search from '../../models/search'
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

@connect(({ city }) => ({
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
    onFocus: null,
    onSearch: null,
    titleStyle: {}
  }

  state = {
    searchText: ''
  }

  componentDidShow() {
    this.setState({
      searchText: ''
    })
  }

  handleChangeText = value => {
    this.setState({
      searchText: value.trim()
    })
  }
  onLocate = e => {
    const { navigate } = this.props
    e.stopPropagation()
    navigate &&
      Taro.navigateTo({
        url: '../search/index'
      })
  }

  onActionClick = e => {
    const { navigate } = this.props
    const {searchText} = this.state
    if (!searchText) return
    e.stopPropagation()

    if (navigate) {
      Taro.navigateTo({
        url: '../search/index?value=abc'+searchText
      })
      this.props.dispatch({
        type: 'search/getSearchResult',
        value: searchText,
          success: (result)=>{
            if (!result || result.length === 0) {
              Taro.showToast({
                title: '找不到关联项目',
                icon: 'none'
              })
            }
          },
          fail: (msg)=>{
            Taro.showToast({
              title: msg || '搜索错误',
              icon: 'error'
            })
          }
      })
    } else {
      const history = Taro.getStorageSync(STORAGE.HISTORY)
      const histories = history && history.length ? history.split(',') : []
      if (searchText && histories.indexOf(searchText) === -1) {
        histories.unshift(searchText)
        Taro.setStorageSync(STORAGE.HISTORY, histories.toString())
      }
    }
  }

  onBack = e => {
    e.stopPropagation()
    Taro.navigateBack()
  }

  render() {
    const { searchText } = this.state
    const {
      opacity,
      title,
      showSearch,
      showBack,
      showBackOnly,
      navigate,
      cityList,
      currentCity,
      titleStyle
    } = this.props

    if (showBackOnly) {
      return <View className='back-btn' onClick={this.onBack} />
    }
    return (
      <View
        className='bar'
        style={
          showSearch
            ? { height: Taro.$statusBarHeight + 204 + 'rpx' }
            : { height: Taro.$statusBarHeight + 134 + 'rpx' }
        }
      >
        <View className='back' style={{ opacity: opacity || 0 }} />
        {showBack && (
          <View
            className='back-btn'
            style={{ marginTop: Taro.$statusBarHeight + 32 + 'rpx' }}
            onClick={this.onBack}
          />
        )}
        <View
          className='title'
          style={{ marginTop: Taro.$statusBarHeight + 38 + 'rpx', ...titleStyle  }}
        >
          {title}
        </View>
        {showSearch && (
          <View className='search-bar'>
            <View className='location' onClick={this.onLocate}>
              {currentCity.name}
            </View>
            <View className='search'>
              <AtSearchBar
                customStyle={{ backgroundColor: 'transparent', padding: 0 }}
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
