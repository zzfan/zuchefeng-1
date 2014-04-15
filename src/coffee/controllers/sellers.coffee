###
controllers for seller
###

mongoose = require 'mongoose'
Seller = mongoose.model 'Seller'
User = mongoose.model 'User'
utils = require '../../lib/utils'
extend = require('util')._extend

exports.login = (req, res) ->
  res.render 'sellers/login',
    title: '公司用户登录'
    message: req.flash 'error'

exports.signup = (req, res) ->
  res.render 'sellers/signup',
    title: '公司用户注册'
    user: new Seller()

exports.logout = (req, res) ->
  req.logout()
  res.redirect('/login')

exports.session = (req, res) ->
  redirectTo = if req.session.returnTo then req.session.returnTo else '/'
  delete req.session.returnTo
  res.redirect(redirectTo)

exports.create = (req, res) ->
  seller = new Seller(req.body)
  seller.type = 'Seller'
  seller.save (err) ->
    if err
      res.render 'sellers/signup',
        title: '公司用户注册'
        user: seller
    else
      req.logIn seller, (err) ->
        if err then next err else res.redirect '/'

exports.edit = (req, res) ->
  res.render 'sellers/edit',
    user: req.user
    title: '编辑用户信息'

exports.update = (req, res) ->
  seller = req.profile
  seller = extend seller,
    company:
      name: req.body.companyName
      subname: req.body.companySubname
      addr: req.body.companyAddr
      desc: req.body.companyDesc
    fix: req.body.fix
    mobile: req.body.mobile
  seller.save (err) ->
    if err
      throw err
    else
      req.flash 'success', '成功更新信息'
      res.redirect "/sellers/#{seller._id}/dashboard"

exports.head = (req, res) ->
  seller = req.profile
  if req.files.image.originalFilename
    seller.moveAndSave req.file.image, (err) ->
      if err throw err
      else
        req.flash 'success', '成功上传头像'
        res.redirect "/sellers/#{seller._id}/dashboard"
  else
    res.redirect "/sellers/#{seller._id}/dashboard"

exports.load = (req, res, next, id) ->
  Seller.load id (err, seller) ->
    if err then next err
    else if not seller then next new Error '载入用户失败'
    else req.profile = seller; next()

exports.dashboard = (req, res) ->
  if req.user._id.toString() == req.profile._id.toString()
    res.render 'sellers/dashboard',
      title: '公司控制面板'
      user: req.profile
  else
    res.redirect '/'

exports.show = (req, res) ->
  res.render 'sellers/show',
    title: '公司详情'
    user: req.profile
