export default {
  pages: [
    'pages/home/index',
    'pages/login/index',
    'pages/manualLogin/index',
    'pages/captcha/index',
    'pages/publish/index',
    'pages/discovery/index',
    'pages/discoveryDetail/index',
    'pages/schedule/index',
    'pages/mine/index',
    'pages/more/index',
    'pages/product/index',
    'pages/payGift/index',
    'pages/address/index',
    'pages/saveAddress/index',
    'pages/moreProduct/index',
    'pages/search/index',
    'pages/payProduct/index',
    'pages/allOrders/index',
    'pages/allFavors/index',
    'pages/allLikes/index',
    'pages/profile/index',
    'pages/profileModify/index',
    'pages/myBill/index',
    'pages/invite/index',
    'pages/myBalance/index',
    'pages/coupon/index',
    'pages/dayChartered/index',
    'pages/utilPages/location/index',
    'pages/pkg/index',
    'pages/carType/index',
    'pages/createOrder/index',
    'pages/comments/index',
    'pages/orderStatus/index',
    'pages/airport/index',
    'pages/routeDetail/index',
    'pages/evaluate/index',
    'pages/newUser/index',
    'pages/customerService/index',
    'pages/billManager/index',
    'pages/createBill/index',
    'pages/billHead/index',
    'pages/headers/index',
    'pages/allBill/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationStyle: 'custom',
    navigationBarTextStyle: 'black',
    enablePullDownRefresh: false,
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    }
  },
  tabBar: {
    color: '#b2b1af',
    selectedColor: '#000000',

    // backgroundColor: 'transparent',
    // borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './asset/images/home.png',
        selectedIconPath: './asset/images/home_focus.png',
      },
      {
        pagePath: 'pages/discovery/index',
        text: '发现',
        iconPath: './asset/images/discovery.png',
        selectedIconPath: './asset/images/discovery_focus.png'
      },
      {
        pagePath: 'pages/schedule/index',
        text: '行程',
        iconPath: './asset/images/schedule.png',
        selectedIconPath: './asset/images/schedule_focus.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: './asset/images/mine.png',
        selectedIconPath: './asset/images/mine_focus.png',
      },
    ],
  },
}
