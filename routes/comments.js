const router = require('koa-router')()
// 三级嵌套
router.prefix('/api/questions/:questionId/answers/:answerId/comments')

const { auth } = require('../middlewares/auth')

const {
  find, findById, create, update, delete: del, checkCommentator, checkCommentExist,
} = require('../controllers/comments')

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkCommentExist, findById)
router.patch('/:id', auth, checkCommentExist, checkCommentator, update)
router.delete('/:id', auth, checkCommentExist, checkCommentator, del)

module.exports = router
