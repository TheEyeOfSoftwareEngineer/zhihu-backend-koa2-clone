## Session

### Session工作原理
![session.jpg](https://i.loli.net/2021/01/26/ShbY2jCExqV38te.jpg)

### 好处
- 相比于JWT，最大的优势就在于可以主动清楚session
- session保存在服务器端，相对较为安全
- 结合cookie使用，较为灵活，兼容性较好

### 劣势
- cookie+session在跨域场景表现不好（cookie有不可跨域性，有domain限制；可跨域但是需要特别设置）
- 如果是分布式部署，需要做多机共享session机制；需要做增加成本
- 基于cookie的机制很容易被CSRF
- 查询session信息可能会有数据库查询操作

- session：主要存放在服务器端，相对安全
- cookie：主要存放在客户端，相对不安全
- sessionStorage：仅在当前会话下有效，关闭页面或者浏览器后被清除
- localstorage：除非被清除，否则永久保存




