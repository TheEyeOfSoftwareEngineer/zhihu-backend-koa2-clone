## 设计Schema

- 分析用户模块的属性
- 编写用户模块的Schema
- 使用Schema生成用户Model

```javascript
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  name: {type: String, required: true},
  age: { type: Number, required: false, default: 0},
})

module.exports = model('User', userSchema) //导出类
```
