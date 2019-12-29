// vue.config.js
module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  devServer: {
    port: 8089
  }
  //   configureWebpack: {
  //     module: {
  //       rules: [
  //         {
  //           // 匹配 *.work.js
  //           test: /\.work\.js$/,
  //           use: {
  //             loader: "worker-loader",
  //             options: {
  //               inline: true
  //               //   name: "[name]:[hash:8].js",
  //               // fallback: false
  //               // publicPath: '/scripts/workers/'
  //             }
  //           }
  //         }
  //       ]
  //     }
  //   }
};
