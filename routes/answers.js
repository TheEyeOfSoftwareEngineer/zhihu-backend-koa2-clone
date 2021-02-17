const router = require('koa-router')()
// 二级嵌套
router.prefix('/api/questions/:questionId/answers')

const { auth } = require('../middlewares/auth')

const {
  find, findById, create, update, delete: del, checkAnswerer, checkAnswerExist,
} = require('../controllers/answers')

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkAnswerExist, findById)
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update)
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del)

module.exports = router
