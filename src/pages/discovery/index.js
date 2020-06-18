import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import '../common/index.less'

import homePng from '../../asset/images/bkg2.png'
import SwitchButton from '../../components/SwitchButton'

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

  state = {
    isRight: false
  }
  onChange = isRight => {
    this.setState({
      isRight
    })
  }
  render() {
    const {isRight} = this.state
    return (
      <View className='page'>   
        <Image className='common-image' src={homePng} />
        <SwitchButton isRight={isRight} onChange={this.onChange} />
      </View>
    )
  }
}

export default Home
