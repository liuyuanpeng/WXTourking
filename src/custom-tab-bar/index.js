import Taro from '@tarojs/taro'
import { CoverView, CoverImage } from '@tarojs/components'
import './index.scss'

class TabBar extends Taro.Component {
  state = {
    selected: 0,
    color: '#B2B1AF',
    selectedColor: '#000000',
    list: [
      {
        pagePath: '../home/index',
        text: '首页',
        iconPath: '../asset/images/home.png',
        selectedIconPath: '../asset/images/home_focus.png'
      },
      // {
      //   pagePath: '../discovery/index',
      //   text: '发现',
      //   iconPath: '../asset/images/discovery.png',
      //   selectedIconPath: '../asset/images/discovery_focus.png'
      // },
      {
        pagePath: '../schedule/index',
        text: '行程',
        iconPath: '../asset/images/schedule.png',
        selectedIconPath: '../asset/images/schedule_focus.png'
      },
      {
        pagePath: '../mine/index',
        text: '我的',
        iconPath: '../asset/images/mine.png',
        selectedIconPath: '../asset/images/mine_focus.png'
      }
    ]
  }

  switchTab = item => {
    const url = item.pagePath
    Taro.switchTab({
      url
    })
  }
  componentDidMount() {
    this.setState({
      selected: this.props.ind
    })
  }

  render() {
    return (
      <CoverView className='tab-bar'>
        <CoverView className='tab-bar-wrap'>
          {this.state.list.map((item, index) => {
            return (
              <CoverView
                className='tab-bar-wrap-item'
                onClick={this.switchTab.bind(this, item)}
                data-path={item.pagePath}
                key={item.text}
              >
                <CoverImage
                  className='tab-bar-wrap-item-icon'
                  src={
                    this.state.selected === index
                      ? item.selectedIconPath
                      : item.iconPath
                  }
                />
                <CoverView
                  className='tab-bar-wrap-item-btn'
                  style={{
                    color:
                      this.state.selected === index
                        ? this.state.selectedColor
                        : this.state.color
                  }}
                >
                  {item.text}
                </CoverView>
              </CoverView>
            )
          })}
        </CoverView>
      </CoverView>
    )
  }
}
export default TabBar

// 这里导航栏内容可以自行配置
