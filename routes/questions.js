const router = require('koa-router')()
router.prefix('/api/questions')

const { auth } = require('../middlewares/auth')

const {
  find, findById, create, update, delete: del, checkQuestioner, checkQuestionExist,
} = require('../controllers/questions')

router.get('/', find)
router.post('/', auth, create)
router.get('/:id', checkQuestionExist, findById)
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update)
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del)

module.exports = router
