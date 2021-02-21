// gzip压缩
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CompressionWebpackPlugin = require("compression-webpack-plugin");

module.exports = {
  // 项目打包生成目录
  outputDir: "/usr/local/Cellar/tomcat/9.0.41/libexec/webapps/chat-system/",
  // 静态资源生成目录（相对于outputDir
  assetsDir: "static",
  // 关闭线上源码
  productionSourceMap: false,
  // css相关配置
  // 图片在10kb以内使用内联base64图片
  chainWebpack: config => {
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => Object.assign(options, { limit: 10240 }));
  },
  // 部署应用包时的基本 URL(解决build打包后资源文件404问题) :https://cli.vuejs.org/zh/config/#baseurl
  publicPath: "./",
  devServer: {
    open: true,
    compress: true,
    port: 8020,
    https: false,
    hotOnly: false,
    proxy: null
  },
  // 关闭生产环境console
  configureWebpack(config) {
    if (process.env.NODE_ENV === "production") {
      // eslint-disable-next-line @typescript-eslint/camelcase
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      // gzip压缩
      const productionGzipExtensions = ["html", "js", "css"];
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      );
    }
  }
};
