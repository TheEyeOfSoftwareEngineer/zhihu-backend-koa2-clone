## MongoDB
- 性能好（内存计算）
- 大规模数据存储（可扩展性）
- 可靠安全（本地复制、自动故障转移）
- 方便存储复杂数据结构（Schema Free）

### MongoDB Atlas

#### 创建集群

#### 添加数据库用户

#### 设置IP地址白名单

#### 获取连接地址

#### Mongoose连接MongoDB
```javascript
const mongoose = require('mongoose')

mongoose.connect(CONF.mongolink, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log("mongo is linking now...")
})
mongoose.connection.on('error', console.error)
```
