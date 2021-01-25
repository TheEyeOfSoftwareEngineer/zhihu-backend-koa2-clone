class UserController {

  find(ctx) {

  }

  findById(ctx) {

  }

  create(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
    })
    ctx.body = ctx.request.body
  }

  update(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
    })
  }

  delete(ctx) {

  }

}

module.exports = new UserController();