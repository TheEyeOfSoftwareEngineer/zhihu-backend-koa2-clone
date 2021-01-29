const router = require('koa-router')()
router.prefix('/api/users')

const { auth } = require('../middlewares/auth')

const {
  find, findById, create, update, delete: del,
  login, checkUser, listFollowing, follow, unfollow,
  listFollower
} = require('../controllers/users')

router.get('/', find)
router.post('/', create)
router.get('/:id', findById)
// PUT整体替换 PATCH替换一部分属性
router.patch('/:id', auth, checkUser, update)
router.delete('/:id', auth, checkUser, del)
router.post('/login', login)
router.get('/:id/following', listFollowing)
router.get('/:id/listfollower', listFollower)
router.put('/following/:id', auth, follow)
router.delete('/following/:id', auth, unfollow)

module.exports = router
