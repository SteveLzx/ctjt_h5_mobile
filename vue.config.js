const px2rem = require('postcss-px2rem-exclude');

const port = process.env.port || 8088;
module.exports = {
  devServer: { // 开发环境启动express做接口mock
    port,
    open: true,
    before: () => require('./mock/express.ts'),
    proxy: {
      '/api': {
        // target: 'http://localhost:3034/',
        // target: 'https://dev.aicar365.com/',
        target: 'https://www.test.aicar365.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
      }
    },
  },
  configureWebpack: {
    name: '',
    externals: {
      Aliplayer: 'Aliplayer',
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery'
    },
  },
  productionSourceMap: false
};
