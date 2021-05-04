import Taro from '@tarojs/taro'
import React from 'react'
import { View } from '@tarojs/components'

import './index.scss'

class CountDown extends React.Component {
  static defaultProps = {
    counts: 60,
    format: '',
    onTimeUp: null,
    wrapClass: ''
  }

  state = {
    currentCount: 0
  }

  constructor(props) {
    super(props)
    this.state = {
      currentCount:  props.counts || 0
    }
  }

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
    const {currentCount} = this.state
    const { format, wrapClass } = this.props
    return (
     <View className={wrapClass}>
       {`${currentCount}${format}`}
     </View>
      )
  }
}
export default CountDown