const koa = require('koa')
const mount = require('koa-mount')
const path = require('path')
const static = require('koa-static')
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
const webpack = require('webpack')

const config = require('./webpack.config')

const app = koa()
const port = process.env.PORT || 3000

app.use(mount('/static', webpackDevMiddleware(webpack(config))))
app.use(static(path.join(__dirname, 'src')))

app.listen(port)
console.log('Listening on port ' + port)
