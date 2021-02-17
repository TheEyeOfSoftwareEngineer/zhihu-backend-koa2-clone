const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/comments')
const {CONF} = require('../conf/conf')

class UserController {

  async find(ctx) {    
    const {per_page = 10} = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    ctx.body =  await User.find({
      name: new RegExp(ctx.query.q)
    }).limit(perPage).skip(page * perPage)
  }

  async findById(ctx) {
    const {fields = ''} = ctx.query
    const selectFileds = fields.split(';').filter(f=>f).map(f=> " +"+f).join('')
    const populateFields = fields.split(';').filter(f=>f).map(f=>{
      if(f === 'employments') {
        return 'employments.company employments.job'
      }
      if(f === 'educations') {
        return 'education.school education.major'
      }
      return f
    }).join(' ')
    const user = await User.findById(ctx.params.id).select(selectFileds).populate(populateFields)
    if(!user) { 
      ctx.throw(404, '该用户不存在')       
    }
    ctx.body = user
  }

  async create(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
      password: {type: 'string', required: true}
    })
    const {name} = ctx.request.body;
    const repeatedUsername = await User.findOne({name})
    if(repeatedUsername) { ctx.throw(409, '用户名已经被占用') }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }

  async update(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: false},
      password: {type: 'string', required: false},
      avatar_url: {type: 'string', required: false},
      gender: {type: 'string', required: false},
      headline: {type: 'string', required: false},
      locations: {type: 'array', itemType: 'string', required: false},
      business: {type: 'string', required: false},
      employments: {type:'array', itemType: 'object', required: false},
      educations: {type:'array', itemType: 'object', required: false},
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if(!user) {
      ctx.throw(404, "该用户不存在")      
    }
    ctx.body = user;
  }

  async delete(ctx) {
    const user =  await User.findByIdAndRemove(ctx.params.id)
    if(!user) {
      ctx.throw(404, "该用户不存在")
    }
    ctx.body = user
  }

  async login(ctx) {
    ctx.verifyParams({
      name: {type: 'string', required: true},
      password: {type: 'string', require: true}
    })
    const user = await User.findOne(ctx.request.body)
    if(!user) ctx.throw(401, "用户名或密码不正确")
    const {_id, name} = user
    const token = jwt.sign({_id, name}, CONF.jwtkey, {expiresIn: '1d'})
    ctx.body = { token }
  }

  // 鉴权
  async checkUser(ctx, next) {
    if(ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, "无权操作")
    }
    await next()
  }

  async listFollowing(ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate('following')
    if(!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.following
  }

  async listFollower(ctx) {
    const users = await User.find({following: ctx.params.id})
    ctx.body = users
  }

  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id)
    if(!user) {ctx.throw(404, '用户不存在')}
    await next()
  }

  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    if(!me.following.map(id=>id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204;
  }

  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    const index = me.following.map(id=>id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204;
  }

  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    if(!me.followingTopics.map(id=>id.toString()).includes(ctx.params.id)) {
      me.followingTopics.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204;
  }

  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    const index = me.followingTopics.map(id=>id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.followingTopics.splice(index, 1)
      me.save()
    }
    ctx.status = 204;
  }

  async listFollowingTopics(ctx) {
    const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
    if(!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.followingTopics
  }

  async listQuestions(ctx) {
    const questions = await Question.find({questioner: ctx.params.id})
    ctx.body = questions
  }

  async likeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    if(!me.likingAnswers.map(id=>id.toString()).includes(ctx.params.id)) {
      me.likingAnswers.push(ctx.params.id)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: 1}})
    }
    ctx.status = 204
    await next()
  }

  async unlikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+likingAnswers')
    const index = me.likingAnswers.map(id=>id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.likingAnswers.splice(index, 1)
      me.save()
      await Answer.findByIdAndUpdate(ctx.params.id, {$inc: {voteCount: -1}})
    }
    ctx.status = 204
  }

  async listLikeAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers')
    if(!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.likingAnswers
  }

  async dislikeAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+dislikeAnswers')
    if(!me.dislikeAnswers.map(id=>id.toString()).includes(ctx.params.id)) {
      me.dislikeAnswers.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204;
    await next()
  }

  async undislikeAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+dislikeAnswers')
    const index = me.dislikeAnswers.map(id=>id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.dislikeAnswers.splice(index, 1)
      me.save()
    }
    ctx.status = 204;
  }

  async listDislikeAnswers(ctx) {
    const user = await User.findById(ctx.params.id).select('+dislikeAnswers').populate('dislikeAnswers')
    if(!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.dislikeAnswers
  }

  async collectionAnswer(ctx, next) {
    const me = await User.findById(ctx.state.user._id).select('+collectionAnswers')
    if(!me.collectionAnswers.map(id=>id.toString()).includes(ctx.params.id)) {
      me.collectionAnswers.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204;
    await next()
  }

  async uncollectionAnswer(ctx) {
    const me = await User.findById(ctx.state.user._id).select('+collectionAnswers')
    const index = me.collectionAnswers.map(id=>id.toString()).indexOf(ctx.params.id)
    if(index > -1) {
      me.collectionAnswers.splice(index, 1)
      me.save()
    }
    ctx.status = 204;
  }

  async listCollectionAnswer(ctx) {
    const user = await User.findById(ctx.params.id).select('+collectionAnswers').populate('collectionAnswers')
    if(!user) {ctx.throw(404, '用户不存在')}
    ctx.body = user.collectionAnswers
  }

}

module.exports = new UserController();