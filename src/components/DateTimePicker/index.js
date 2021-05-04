import Taro from '@tarojs/taro'
import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { AtIcon } from 'taro-ui'
import { View, Text, PickerView, PickerViewColumn } from '@tarojs/components'
import { getPickerViewList, getArrWithTime } from './utils'
import dayjs from 'dayjs'
import './index.scss'

class DateTimePicker extends Component {
  state = {
    dayList: [], //日 -下拉
    hourList: [], //时 -下拉
    minuteList: [], //分 -下拉
    selectIndexList: [1, 1, 1, 1, 1], //PickerViewColumn选择的索引
    fmtInitValue: '', //初始值
    current: '', //当前选择的数据
    visible: false, //是否可见
    dateTime: dayjs(),
  }
  // 打开时间选择的模态框 - 根据当前时间初始化picker-view的数据
  openModal = () => {
    const { hidePassed } = this.props
    const { current, fmtInitValue } = this.state
    const selectIndexList = []
    let dateTime
    if (current) {
      dateTime = dayjs(
        current
          .replace('年', '-')
          .replace('月', '-')
          .replace('日', '')
      )
    } else if (fmtInitValue) {
      dateTime = dayjs(fmtInitValue)
    } else {
      dateTime = dayjs()
    }
    const { dayListValue, dayList, hourList, minuteList } = getPickerViewList(
      hidePassed
    )

    const year = dateTime.year()
    const month = dateTime.month() + 1
    const day = dateTime.date()
    const hour = dateTime.hour()
    const minute = dateTime.minute()

    this.dayListValue = dayListValue

    //根据arr  数据索引
    selectIndexList[0] = dayListValue.findIndex(
      (value) =>
        value.year === Number(year) &&
        value.month === Number(month) &&
        value.day === Number(day)
    )
    selectIndexList[1] = hourList.indexOf(hour)
    selectIndexList[2] = minuteList.indexOf(minute)

    this.setState({
      selectIndexList,
      visible: true,
      dayList,
      hourList,
      minuteList,
      dateTime,
    })
  }
  // 取消
  cancelHandel = () => {
    this.setState({
      visible: false,
    })
  }
  // 确定
  okHandel = () => {
    const { showDayOnly = false } = this.props
    const { dateTime } = this.state
    let current
    if (showDayOnly) {
      current = dateTime.format('YYYY年MM月DD日')
    } else {
      current = dateTime.format('YYYY年MM月DD日 HH:mm')
    }

    this.setState({
      current,
      visible: false,
    })
    this.props.onOk &&
      this.props.onOk(showDayOnly ? dateTime.startOf('day') : dateTime)
  }
  // 切换
  changeHandel = (e) => {
    const selectIndexList = e.detail.value
    const [dayIndex, hourIndex, minuteIndex] = selectIndexList
    const { hourList, minuteList } = this.state
    const dayArr = this.dayListValue[dayIndex]
    const hourStr = hourList[hourIndex]
    const minuteStr = minuteList[minuteIndex]
    const { year, month, day } = dayArr

    this.setState({
      dateTime: dayjs(`${year}-${month}-${day} ${hourStr}:${minuteStr}`),
      selectIndexList
    })
  }
  // 清除数据
  clear = () => {
    this.setState({
      current: '',
    })
    this.props.onClear && this.props.onClear({ current: '' })
  }

  componentDidMount() {
    const { initValue, showDayOnly } = this.props
    const fmtInitValue = initValue
    if (!initValue) return
    let current
    if (showDayOnly) {
      current = initValue.format('YYYY年MM月DD日')
    } else {
      current = initValue.format('YYYY年MM月DD日 HH:mm')
    }
    this.setState({ fmtInitValue, dateTime: initValue, current })
  }

  render() {
    const {
      visible,
      current,
      dayList,
      hourList,
      minuteList,
      selectIndexList,
      dateTime,
    } = this.state
    const WeekArr = ['日', '一', '二', '三', '四', '五', '六']
    const {
      placeholder = '请选择时间',
      showDayOnly = false,
      wrapClass = '',
    } = this.props
    return (
      <View className={wrapClass}>
        <View className='selector-wrap'>
          <View
            className={`selected-item-class ${current ? 'valuation' : ''}`}
            onClick={this.openModal}
          >
            {current ? (
              showDayOnly ? (
                current
              ) : (
                <View className='date-time-show'>
                  <View className='selected-item-day selected-item-day-extern'>
                    {dateTime.format('MM-DD日')}
                  </View>
                  <View className='selected-item-week selected-item-week-extern'>
                    {`周${WeekArr[dateTime.day()]}${dateTime.format('HH:mm')}`}
                  </View>
                </View>
              )
            ) : (
              placeholder
            )}
          </View>
        </View>
        {visible ? (
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
                      {dayList.length ?
                        dayList.map((item, index) => (
                          <View
                            key={String(index)}
                            className='pick-view-column-item'
                          >
                            {item}
                          </View>
                        )):null}
                    </PickerViewColumn>
                    {/*时*/}
                    {!showDayOnly && (
                      <PickerViewColumn className='picker-view-column'>
                        {hourList.length > 0 &&
                          hourList.map((item, index) => (
                            <View
                              key={String(index)}
                              className='pick-view-column-item'
                            >
                              {item}
                            </View>
                          ))}
                      </PickerViewColumn>
                    )}
                    {/*分*/}
                    {!showDayOnly && (
                      <PickerViewColumn className='picker-view-column'>
                        {minuteList.length > 0 &&
                          minuteList.map((item, index) => (
                            <View
                              key={String(index)}
                              className='pick-view-column-item'
                            >
                              {item}
                            </View>
                          ))}
                      </PickerViewColumn>
                    )}
                  </PickerView>
                </View>
              </View>
            </View>
          </View>
        ) : null}
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
export default DateTimePicker
