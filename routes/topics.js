const router = require('koa-router')()
router.prefix('/api/topics')

const { auth } = require('../middlewares/auth')

const {
  find, findById, create, update, checkTopicExist,
  listTopicFollower
} = require('../controllers/topics')

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkTopicExist, findById)
router.patch('/:id', auth, checkTopicExist, update)
router.get('/:id/followers', checkTopicExist, listTopicFollower)

module.exports = router
