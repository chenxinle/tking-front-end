const express = require('express')
const server = express()
const Vue = require('vue')
const path = require('path')
const webpack = require('webpack')
const serverConfig = require('./webpack.server.config')
const clientConfig = require('./webpack.client.config')
const MFS = require('memory-fs')
const fs = require('fs')
const config = require('../config')
const proxy = require('http-proxy-middleware')
const favicon = require('serve-favicon')

var options = {
  target: 'http://localhost:8080', // target host
  changeOrigin: true              // needed for virtual hosted sites
  // pathRewrite: {
  //   '^/api': ''
  // }
}

const isProd = process.env.NODE_ENV === 'production'

const resolve = file => path.resolve(__dirname, file)
const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(config.build.assetsRoot, file), 'utf-8')
  } catch (e) {}
}

const templatePath = resolve('../src/index.template.html')
let template = fs.readFileSync(templatePath, 'utf-8')


let clientManifest
let bundle
let renderer

if (isProd) {
  clientManifest = require('../dist/vue-ssr-client-manifest.json')
  bundle = require('../dist/vue-ssr-server-bundle.json')
  initRenderer(bundle, clientManifest)
} else {
  // modify client config to work with hot middleware
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // dev middleware
  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })

  server.use(devMiddleware)

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return
    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ))
    initRenderer(bundle, clientManifest)
  })
  // hot middleware
  server.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))

  //server
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    console.log(stats.errors)
    if (stats.errors.length) return

    // read bundle generated by vue-ssr-webpack-plugin
    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
    initRenderer(bundle, clientManifest)
  })

}

function initRenderer(bundle, clientManifest) {
  console.log('new renderer')
  // let serverBundleJsonPath = path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json')

  /**
   * 这里有个大坑，在dev环境下webpack(serverConfig)并没有生成vue-ssr-server-bundle.json
   * 而是存在内存中，所以用mfs去读这个字符串
   * 如果使用path.resolve(__dirname, '../dist/vue-ssr-server-bundle.json')，则会报文件不存在的错误
   */
  const { createBundleRenderer } = require('vue-server-renderer')
// const renderer = require('vue-server-renderer').createRenderer()
  renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: template,
    clientManifest: clientManifest
  })
}


const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

/**
 * 服务器启起来之后静态资源文件夹
 * 和项目目录没有关系，即使项目目录中有这个文件夹
 * 但是没有下面这段代码，服务器不会去项目中找这个文件夹
 */
server.use('/dist', serve('../dist', true))

server.use('/api', proxy(options))

server.use(favicon(resolve('../build/logo.jpg')))

server.get('*', (req, res) => {

  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }

  const context = {
    url: req.url,
    title: '个人微博'
  }
  res.setHeader("Content-Type", "text/html")

  renderer.renderToString(context, (err, html) => {

    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
    }
  })
})

server.listen(3332)