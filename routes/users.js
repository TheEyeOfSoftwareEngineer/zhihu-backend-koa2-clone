const router = require('koa-router')()

router.prefix('/api/users')

const {find, findById, create, update, delete: del} = require('../controllers/users')

router.get('/', find)
router.post('/', create)
router.get('/:id', findById)
router.put('/:id', update)
router.delete('/:id', del)

module.exports = router
