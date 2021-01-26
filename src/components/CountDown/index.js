import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

class CountDown extends Taro.Component {
  static defaultProps = {
    counts: 60,
    format: '',
    onTimeUp: null
  }

  constructor(props) {
    this.state = {
      // eslint-disable-next-line taro/duplicate-name-of-state-and-props
      currentCount: props.counts || 0
    }
  }

  static externalClasses = ['wrap-class']

  componentDidMount() {
    this.timer = setInterval(() => {
      const {currentCount} = this.state
      if (currentCount === 0) {
        this.onTimeUp()
      }
      else {
        this.setState({
          currentCount: currentCount - 1
        })
      }
    }, 1000);
  }
  

  onTimeUp = () => {
    clearInterval(this.timer)
    this.props.onTimeUp && this.props.onTimeUp()

  }

  render() {
    const { currentCount, format } = this.props
    return (
     <View className='wrap-class'>
       {`${currentCount}${format}`}
     </View>
      )
  }
}
export default CountDown