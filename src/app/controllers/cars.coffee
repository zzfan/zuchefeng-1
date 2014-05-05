###
Controller for cars
###

mongoose = require 'mongoose'
Car = mongoose.model 'Car'
Order = mongoose.model 'Order'
utils = require '../../lib/utils'
extend = require('util') ._extend

exports.load = (req, res, next, id) ->
  Car.load id, (err, car) ->
    if err then next err
    else if not car then next new Error 'not found'
    else req.car = car; next()

exports.new = (req, res) ->
  res.render 'cars/new',
    title: '添加新车'
    car: new Car()

exports.create = (req, res) ->
  car = new Car req.body
  car.seller = req.user
  cb = (err) ->
    exports.edit req, res if err
    req.flash 'info', '成功创建新车'
    req.user.addCar car
    res.redirect "/cars/#{car._id}"
  if req.files.image.originalFilename
    car.addImageUrl (utils.moveToUpload req.files.image), cb
  else
    car.save cb

exports.index = (req, res) ->
  page = if req.param 'page' > 0 then req.param 'page' else 1
  page -= 1
  perPage = 30
  options =
    perPage: perPage
    page: page
  Car.list options, (err, cars) ->
    return res.render '500' if err
    Car.count().exec (err, count) ->
      res.render 'cars/index',
        title: '单车列表'
        cars: cars
        page: page+1
        pages: Math.ceil count/perPage

exports.edit = (req, res) ->
  res.render 'cars/edit',
    title: '更新车辆信息'
    car: req.car

exports.detail = (req, res) ->
  res.render 'cars/detail',
    title: '编辑汽车图文详情'
    car: req.car

exports.updateDetail = (req, res) ->
  console.log req.body.html
  car = req.car
  # TODO validation
  car.detail = req.body.html
  car.save (err) ->
    throw err if err
    res.send 'success'

exports.update = (req, res) ->
  car = req.car
  car = extend car, req.body
  cb = (err) ->
    exports.edit req, res if err
    res.redirect "/cars/#{car._id}"
  if req.files.image.originalFilename
    car.addImageUrl (utils.moveToUpload req.files.image), cb
  else
    car.save cb

exports.show = (req, res) ->
  res.render 'cars/show',
    title: req.car.title
    car: req.car
    user: req.user

exports.destroy = (req, res) ->
  car = req.car
  car.remove (err) ->
    req.flash 'info', '成功删除'
    res.redirect('/cars')

exports.order = (req, res) ->
  res.render 'cars/order',
    title: '订单确认'
    car: req.car
    user: req.user

exports.createOrder = (req, res) ->
  cb = (err) ->
    throw err if err
  order = new Order req.body
  order.buyer = req.user
  order.car = req.car
  order.save cb
  # TODO use order and wrap _id in model
  req.car.addOrder order._id
  req.user.addOrder order._id
  # TODO redirect to the order page
  res.redirect '/'

exports.imageUpload = (req, res) ->
  url = utils.moveFile req.files.image, '/img/upload'
  res.end url
