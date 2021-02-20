// const HOST = '"https://apis.kingtrip.vip"'
const HOST = '"https://apis.kingtrip.vip"'
const IMAGE_HOST = '"http://www.kingtrip.vip"'

// eslint-disable-next-line import/no-commonjs
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    HOST,
    IMAGE_HOST
  },
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}
