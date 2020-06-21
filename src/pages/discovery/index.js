import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import '../common/index.scss'

class Home extends PureComponent {
  config = {
    navigationBarTitleText: '发现'
  }

  componentDidShow () { 
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP && typeof this.$scope.getTabBar === 'function' && this.$scope.getTabBar()) {
      this.$scope.getTabBar().$component.setState({
        selected: 1
      })
    }  
  }

  render() {
    return (
      <View className='page'>   

      </View>
    )
  }
}

export default Home
