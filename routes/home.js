const router = require('koa-router')()
router.prefix('/api/home')

const {index, upload} = require('../controllers/home')

router.get('/', index)
router.post('/upload', upload)

module.exports = router
