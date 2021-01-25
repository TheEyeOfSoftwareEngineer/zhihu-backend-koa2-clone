class HomeController {

  index(ctx) {    
    ctx.body = '<h1>Welcome to Koa2</h1>'
  }

}

module.exports = new HomeController();