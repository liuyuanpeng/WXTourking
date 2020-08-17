// eslint-disable-next-line no-undef
export const host = HOST + '/v5'

// 获取用户信息
export const GET_USER = `${host}/user/get`

// 获取城市列表
export const GET_CITY = `${host}/travel/city/list`

// 获取常用地址
export const GET_LOCATION_LIST = `${host}/travel/address/page`

// 获取车型
export const GET_CAR_TYPES = `${host}/travel/chexing/list`

// 获取座位类型
export const GET_SIT_LIST = `${host}/travel/zuowei/list`

// 获取用车服务
export const GET_CONSUME_LIST = `${host}/travel/consume/list`

// 更新用户信息
export const UPDATE_USER = `${host}/user/update`

// 获取session-key
export const GET_SESSION = `${host}/session/wechat_captcha`

// 获取验证码
export const GET_CAPTCHA = `${host}/session/captcha`

// 解密用户数据
export const GET_PHONE = `${host}/session/decrypt_user_mobile`

// 验证码登录
export const LOGIN = `${host}/user/wechat_captcha_login`

// 首页获取订单数量，车辆型号
export const HOME_INFO = `${host}/travel/consume/service`

// 获取价格
export const GET_PRICE = `${host}/travel/price/count`

// 下单
export const CREATE_ORDER =  `${host}/travel/order/create`

// 模拟支付
export const PAY =  `${host}/travel/order/check_user_pay`

// 常用地址
export const GET_ADDRESS_PAGE = `${host}/travel/address/page`

// 司机评价CODE
export const CODE_COMMENTS = `${host}/travel/config/get?code=CODE_COMMENTS`

// 我的订单列表
export const GET_TRIP_PAGE = `${host}/travel/order/user/page`

// 获取订单详情
export const GET_ORDER_DETAIL =  `${host}/travel/order/get`

// 获取退款金额
export const GET_REFUND = `${host}/travel/refund/refund_count`

// 取消订单
export const CANCEL_ORDER =  `${host}/travel/order/user_cancel`

// 立即支付
export const WAIT_PAY = `${host}/travel/order/wait_pay`

// 评价司机
export const EVALUATE =  `${host}/travel/driver/evaluate`

// 获取首页大图
export const GET_COVERS = `${host}/travel/lunbo/list`

// 获取包车页
export const GET_CHARTERED_PAGE = `${host}/travel/private_consume/page`

// 获取包车列表
export const GET_CHARTERED_LIST = `${host}/travel/private_consume/list`

// 获取包车详情
export const GET_CHARTERED_DETAIL = `${host}/travel/private_consume/get`

// 获取用户地址
export const GET_USER_ADDRESS = `${host}/travel/user_dizhi/list`

// 新增/编辑用户地址
export const SAVE_USER_ADDRESS = `${host}/travel/user_dizhi/save`

// 删除用户地址
export const DELETE_USER_ADDRESS = `${host}/travel/user_dizhi/ADDRESS_ID/delete`