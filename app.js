const Koa = require('koa')
const app = new Koa()

const json = require('koa-json')
const parameter = require('koa-parameter')
const bodyparser = require('koa-body')
const path = require('path')
const onerror = require('koa-json-error')
const logger = require('koa-logger')

const mongoose = require('mongoose')

const registerRoutes = require('./routes')

const {CONF} = require('./conf/conf')

// error handler
// 在生产环境我们不返回stack的信息而在开发环境中返回所有信息
// json化返回信息的处理库
app.use(onerror({
  postFormat: (e, {stack, ...rest}) => 
    process.env.NODE_ENV === 'production' 
    ? rest : {stack, ...rest}     
  }
)) 

mongoose.connect(CONF.mongolink, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("mongo is linking now...")
})
mongoose.connection.on('error', console.error)

// middlewares
app.use(bodyparser({
  multipart: true, // 代表启动文件
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true  // 保留扩展名比如图片名称后的png jpg
  }
}))
app.use(json())
app.use(parameter(app))
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
registerRoutes(app)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
