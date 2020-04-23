import Taro, { PureComponent } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import '../common/index.less'

import homePng from '../../asset/images/bkg2.png'

class Home extends PureComponent {
  config = {
    navigationBarTitleText: '发现'
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
