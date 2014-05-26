###
controller for users
###

mongoose = require 'mongoose'
User = mongoose.model 'User'
utils = require '../../lib/utils'

exports.login = (req, res) ->
  res.render 'users/login',
    title: '登录'
    message: req.flash 'error'

exports.signup = (req, res) ->
  res.render 'users/signup',
    title: '注册'
    user: new User()

exports.logout = (req, res) ->
  req.logout()
  res.redirect '/login'

exports.session = (req, res) ->
  redirectTo = if req.session.returnTo then req.session.returnTo else '/'
  delete req.session.returnTo
  res.redirect redirectTo

exports.create = (req, res) ->
  user = new User req.body
  user.type = 'buyer'
  user.save (err) ->
    if err
      res.render '/users/signup',
        user: user
        title: '注册'
    else
      req.logIn user, (err) ->
        if err then next err else res.redirect '/'

exports.load = (req, res, next, id) ->
  User.load id, (err, user) ->
    if err then next err
    else if not user then next new Error '载入用户失败'
    else req.profile = user; next()

exports.show = (req, res) ->
  user = req.profile
  if req.user._id.toString() is user._id.toString()
    res.render 'users/show',
      title: '我的个人中心'
      user: user
  else
    res.redirect('/')
