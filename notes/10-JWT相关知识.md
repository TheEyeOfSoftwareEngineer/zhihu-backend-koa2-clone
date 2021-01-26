## JWT
- JSON Web Token
- 一个开放标准(RFC 7519)
- 定义了一种紧凑且独立的方式，可以将各方之间的信息作为JSON对象进行安全传输
- 该信息可以验证和信息，因为是经过数字签名的（数字签名算法 秘钥+Token）

### JWT构成
- 头部 header
  - 包含两个变量-typ和alg的JSON对象转换成hash字符串
  - 变量1 typ：token的类型，这里固定为JWT
  - 变量2 alg：使用的hash算法，例如HMAC SHA256或者RSA
- 有效载荷 Payload
  - 存储需要传递的信息，如用户ID，用户名等
  - 还包含元数据，如过期时间、发布人等
  - 与Header不同，payload可以加密
- 签名 Signature
  - 对Header和payload进行签名加密
  - 保证Token在传输的过程中没有被篡改或者损坏

```
Signature = HMACSHA256(base64UrlEncode(header)+"."+base64UrlEncode(payload), secret)
```

![jwt.jpg](https://i.loli.net/2021/01/26/sOU4DbKBWieAd3S.jpg)

### JWT对比Session
- 可扩展性(JWT无状态 更佳)
- 安全性(xss 签名加密JWT 敏感数据不放在JWT； CSRF跨站请求攻击；中间人攻击 HTTPS；防止重复攻击 可以把 认证数据生命设置短一点)
- RESTful API
- 性能（JWT开销更大，但需要的信息都在JWT不需要查询；Session需要查询也消耗性能）
- 时效性 （JWT不能实时更新，只能等实时更新 这一点不如session）

### 操作JWT
- 签名
- 验证

使用jsonwebtoken

```javascript
jwt = require('jsonwebtoken')

// 生成token
token = jwt.sign({
  name: 'username'  
}, 'secret')  // secret为秘钥

// 后端解码
jwt.decode(token)

// 后端验证
jwt.verify(token, 'secret')
```

#### 实际操作
```javascript
  async login(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
      password: {type: 'string', require: true}
    })
    const user = await User.findOne(ctx.request.body)
    if(!user) ctx.throw(401, "用户名或密码不正确")
    const {_id, name} = user
    const token = jwt.sign({_id, name}, CONF.jwtkey, {expiresIn: '1d'})
    ctx.body = { token }
  }
```


