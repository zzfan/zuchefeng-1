###
model for sellers
###

mongoose = require 'mongoose'
Schema = mongoose.Schema
crypto = require 'crypto'
utils = require '../../lib/utils'

SellerSchema = new Schema
  name: type: String, default: ''
  company:
    name: type: String, default: ''
    addr: type: String, default: ''
    subname: type: String, default: ''
    desc: type: String, default: ''
  fix: type: String, default: ''
  mobile: type: String, default: ''
  type: type: String, default: ''
  email: type: String, default: ''
  hashed_password: type: String, default: ''
  salt: type: String, default: ''
  cars: [ type: Schema.ObjectId, ref: 'Car']
  image: type: String, default: ''

SellerSchema.virtual('password')
.set (password) ->
  @_password = password
  @salt = @makeSalt()
  @hashed_password = @encryptPassword(password)
.get ->
  @_password

SellerSchema.methods =
  authenticate: (password) ->
    @hashed_password is @encryptPassword password
  makeSalt: ->
    Math.round(new Date()).valueOf() * Math.random() + ''
  encryptPassword: (password) ->
    return '' if not password
    try
      encrypred = crypto.createHmac 'sha1', @salt
                  .update password
                  .digest 'hex'
    catch err
      ''
  addCar: (car) ->
    @cars.push(car._id)
    @save (err) ->
      throw err if err
  addImageUrl: (url) ->
    @image = url
    @save (err) ->
      throw err if err

SellerSchema.statics =
  load: (id, cb) ->
    @findOne _id: id
    .populate 'cars'
    .exec cb

mongoose.model 'Seller', SellerSchema
