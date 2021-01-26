import Taro, { Component } from '@tarojs/taro'
// import PropTypes from 'prop-types';
import { View, Text, PickerView, PickerViewColumn } from '@tarojs/components'
import './index.scss'

class DaysPicker extends Component {
  static externalClasses = ['wrap-class', 'selected-item-class']

  state = {
    dayList: [], //日 -下拉
    fmtInitValue: 1, //初始值
    current: 1, //当前选择的数据
    visible: false, //是否可见
    currentDays: 1
  }
  // 打开时间选择的模态框 - 根据当前时间初始化picker-view的数据
  openModal = () => {
    const { current, fmtInitValue } = this.state
    const selectIndexList = []
    let currentDays
    if (current) {
      currentDays = current
    } else if (fmtInitValue) {
      currentDays = fmtInitValue
    } else {
      currentDays = 1
    }

    const dayListValue = []
    const dayList = []
    for (let i = 1; i <= 30; i++) {
      dayListValue.push(i)
      dayList.push(`${i}天`)
    }

    this.dayListValue = dayListValue

    //根据arr  数据索引
    selectIndexList[0] = dayListValue.findIndex(value => value === currentDays)

    this.setState({
      selectIndexList,
      visible: true,
      dayList,
      currentDays
    })
  }
  // 取消
  cancelHandel = () => {
    this.setState({
      visible: false
    })
  }
  // 确定
  okHandel = () => {
    const { currentDays } = this.state
    this.setState({
      current: currentDays,
      visible: false
    })
    this.props.onOk && this.props.onOk({ currentDays })
  }
  // 切换
  changeHandel = e => {
    const selectIndexList = e.detail.value
    const [dayIndex] = selectIndexList
    const days = this.dayListValue[dayIndex]
    this.setState({
      currentDays: days
    })
  }
  // 清除数据
  clear = () => {
    this.setState({
      current: ''
    })
    this.props.onClear && this.props.onClear({ current: '' })
  }

  componentDidMount() {
    const { initValue } = this.props
    const fmtInitValue = initValue
    this.setState({ fmtInitValue, current: initValue })
  }

  render() {
    const {
      visible,
      current,
      dayList,
      selectIndexList
    } = this.state
    const { placeholder = '请选择包车天数' } = this.props
    return (
      <View className='datetime-picker-wrap wrap-class'>
        <View className='selector-wrap'>
          <View
            className={`selected-item-class ${current ? 'valuation' : ''}`}
            onClick={this.openModal}
          >
            {current ? `${current}天` : placeholder}
          </View>
        </View>
        {visible && (
          <View className='wrapper'>
            {/*日期模态框 */}
            <View className='model-box-bg' onClick={this.cancelHandel}></View>
            <View className='model-box'>
              <View className='model-picker'>
                <View className='button-model'>
                  <Text class='btn-txt' onClick={this.cancelHandel}>
                    取消
                  </Text>
                  <Text className='placeholder-txt'>{placeholder}</Text>
                  <Text class='btn-txt' onClick={this.okHandel}>
                    确定
                  </Text>
                </View>
                <View className='cont_model'>
                  <PickerView
                    className='pick-view'
                    indicatorStyle='height: 50px;'
                    value={selectIndexList}
                    onChange={this.changeHandel}
                  >
                    {/*日*/}
                    <PickerViewColumn className='picker-view-column'>
                      {dayList.length &&
                        dayList.map((item, index) => (
                          <View
                            key={String(index)}
                            className='pick-view-column-item'
                          >
                            {item}
                          </View>
                        ))}
                    </PickerViewColumn>
                    
                  </PickerView>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}

// DateTimePicker.prototype = {
//     initValue: PropTypes.string, //初始化时间
//     onClear: PropTypes.func, //清除选择的时间触发
//     onCancel: PropTypes.func, //时间picker 取消时触发
//     onOk: PropTypes.func, //时间picker 确定时触发
// };
export default DaysPicker
