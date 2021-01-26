const jwt = require('koa-jwt')
const { CONF } = require('../conf/conf')

// const auth = async (ctx, next) => {
//   // 认证: 解析token并获取用户信息
//   const { authorization = '' }  = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   console.log(token)
//   try {
//     const user = jwt.verify(token, CONF.jwtkey)
//     ctx.state.user = user
//   } catch (err) {
//     ctx.throw(401, err.message)
//   }
//   await next()
// }

const auth = jwt({ 
  secret: CONF.jwtkey
})

module.exports = {
  auth
}