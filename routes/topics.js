const router = require('koa-router')()
router.prefix('/api/topics')

const { auth } = require('../middlewares/auth')

const {
  find, findById, create, update
} = require('../controllers/topics')

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', findById)
router.patch('/:id', auth, update)

module.exports = router
