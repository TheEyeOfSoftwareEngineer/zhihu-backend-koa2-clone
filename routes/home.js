const router = require('koa-router')()

const {index} = require('../controllers/home')

router.get('/', index)

module.exports = router
