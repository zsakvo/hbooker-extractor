// vue.config.js
module.exports = {
  outputDir: 'server/static',
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    port: 8089,
    proxy: {
      '/api': {
        target: 'https://app.hbooker.com', //目标主机
        changeOrigin: true, //是否跨域 默认true
        ws: true, //代理的WebSockets 默认true
        secure: true, //是否开启ssl加密 https
        pathRewrite: {
          '^/api': '' //路径替换
        }
      }
    }
  }
}
