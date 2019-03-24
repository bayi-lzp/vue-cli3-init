const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}
 // 压缩js
const compress = new CompressionWebpackPlugin(
    {
      filename: info => {
        return `${info.path}.gz${info.query}`
      },
      algorithm: 'gzip',
      threshold: 10240,
      test: new RegExp(
          '\\.(' +
          ['js'].join('|') +
          ')$'
      ),
      minRatio: 0.8,
      deleteOriginalAssets: false
    }
)
module.exports = {
  assetsDir: 'assets',
  publicPath: './',
  lintOnSave: true, // 是否开启编译时是否不符合eslint提示
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      }
    },
    before(app, server) {
      app.get(/.*.(js)$/, (req, res, next) => {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        next();
      })
    }
  },
  // 压缩代码
  configureWebpack: {
    plugins: [compress]
  },
  // 配置
  chainWebpack: (config)=>{
    // 配置别名
    config.resolve.alias
        .set('@', resolve('src'))
        .set('assets',resolve('src/assets'))
        .set('components',resolve('src/components'))
        .set('router',resolve('src/router'))
        .set('utils',resolve('src/utils'))
        .set('static',resolve('src/static'))
        .set('store',resolve('src/store'))
        .set('views',resolve('src/views'))
    // 压缩代码
    config.optimization.minimize(true);
    // 分割代码
    // config.optimization.splitChunks({
    //   chunks: 'all'
    // })
    // 用cdn方式引入
    config.externals({
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'mint-ui': 'MINT',  // 需用MINT
      'axios': 'axios'
    })
  },
  // 引入全局变量
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        data: `
               @import "@/assets/css/variable.scss"; 
               @import "@/assets/css/common.scss";
               @import "@/assets/css/mixin.scss";
              `
      }
    }
  }
}
