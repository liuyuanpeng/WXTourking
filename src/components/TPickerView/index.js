import Taro, { Component } from '@tarojs/taro'
// import PropTypes from 'prop-types';
import { View, Text, PickerView, PickerViewColumn } from '@tarojs/components'
import './index.scss'

class TPickerView extends Component {
  static defaultProps = {
    title: '',
    lists: [], // [{key: 'list1', list: []}, {key: 'list2', list: []}, {key: 'list3', list: []}]
    onOK: null,
    onCancel: null,
    active: [] // [index1, index2, index3...]
  }

  state = {
    current: []
  }

  // 取消
  cancelHandel = () => {
    this.props.onCancel && this.props.onCancel()
  }
  // 确定
  okHandel = () => {
    const { current } = this.state
    const { lists } = this.props
    const result = {}
    lists.map((item, index) => {
      result[item.key] = item.list[current[index]]
    })
    this.props.onOK && this.props.onOK(result)
  }
  // 切换
  changeHandel = e => {
    this.setState({
      current: e.detail.value
    })
  }

  componentWillMount() {
    const { active, lists } = this.props
    if (active && active.length === lists.length) {
      this.setState({
        current: active
      })
    } else {
      this.setState({
        current: lists.map(()=>0)
      })
    }
  }

  render() {
    const { title, lists } = this.props
    const { current } = this.state
    return (
      <View className='picker-wrapper'>
        {/*日期模态框 */}
        <View className='model-box-bg' onClick={this.cancelHandel}></View>
        <View className='model-box'>
          <View className='model-picker'>
            <View className='button-model'>
              <Text class='btn-txt' onClick={this.cancelHandel}>
                取消
              </Text>
              <Text className='placeholder-txt'>{title}</Text>
              <Text class='btn-txt' onClick={this.okHandel}>
                确定
              </Text>
            </View>
            <View className='cont_model'>
              <PickerView
                className='pick-view'
                indicatorStyle='height: 50px;'
                value={current}
                onChange={this.changeHandel}
              >
                {lists.map((listItem, INDEX) => (
                  <PickerViewColumn
                    key={`picker-column-${INDEX}`}
                    className='picker-view-column'
                  >
                    {listItem.list.map((item, index) => (
                      <View
                        key={String(index)}
                        className='pick-view-column-item'
                      >
                        {item}
                      </View>
                    ))}
                  </PickerViewColumn>
                ))}
              </PickerView>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default TPickerView
