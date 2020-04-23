import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import '../common/index.less'

import homePng from '../../asset/images/bkg3.png'

class Home extends PureComponent {
  config = {
    navigationBarTitleText: '行程'
  }

  render() {
    return (
      <View className='page'>
      <Image className='common-image' src={homePng} />
      </View>
    )
  }
}

export default Home
