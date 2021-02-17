const router = require('koa-router')()
router.prefix('/api/users')

const { auth } = require('../middlewares/auth')
const {checkTopicExist} = require('../controllers/topics')
const {checkAnswerExist} = require('../controllers/answers')

const {
  find, findById, create, update, delete: del,
  login, checkUser, listFollowing, follow, unfollow, listFollower, checkUserExist, followTopic, unfollowTopic, listFollowingTopics,
  listQuestions, likeAnswer, unlikeAnswer, listLikeAnswers, dislikeAnswer, undislikeAnswer, listDislikeAnswers, collectionAnswer, uncollectionAnswer, listCollectionAnswer
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

router.get('/:id/questions', listQuestions)

router.get('/:id/likingAnswers', listLikeAnswers)
router.put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer)
router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer)

router.get('/:id/dislikeAnswers', listDislikeAnswers)
router.put('/dislikeAnswers/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer)
router.delete('/dislikeAnswers/:id', auth, checkAnswerExist, undislikeAnswer)

router.get('/:id/collections', listCollectionAnswer)
router.put('/collecting/:id', auth, checkAnswerExist, collectionAnswer)
router.delete('/uncollecting/:id', auth, uncollectionAnswer)

module.exports = router
