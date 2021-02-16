const router = require('koa-router')()
router.prefix('/api/users')

const { auth } = require('../middlewares/auth')
const {checkTopicExist} = require('../controllers/topics')

const {
  find, findById, create, update, delete: del,
  login, checkUser, listFollowing, follow, unfollow, listFollower, checkUserExist, followTopic, unfollowTopic, listFollowingTopics
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
router.put('/following/:id', auth, checkUserExist, follow)
router.delete('/following/:id', auth, checkUserExist, unfollow)

router.get('/:id/followingTopics', listFollowingTopics)
router.put('/followingTopics/:id', auth, checkTopicExist, followTopic)
router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic)

module.exports = router
