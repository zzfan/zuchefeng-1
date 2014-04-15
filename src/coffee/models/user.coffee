###
model for users
###

mongoose = require 'mongoose'
Schema = mongoose.Schema
crypto = require 'crypto'
utils = require '../../lib/utils'

UserSchema = new Schema
  name: type: String, default: ''
  email: type: String, default: ''
  hashed_password: type: String, default: ''
  salt: type: String, default: ''
  type: type: String, default: 'buyer'
  orders: [
    type: Schema.ObjectId, ref: 'Order'
  ]
  cars: [
    type: Schema.ObjectId, ref: 'Car'
  ]
  image: [
    url128x128: type: String, default: ''
    url256x256: type: String, default: ''
  ]

UserSchema.virtual 'password'
.set (password) ->
  @_password = password
  @salt = @makeSalt()
  @hashed_password = @encryptPassword password
.get ->
  @_password

UserSchema.methods =
  authenticate: (password) ->
    @hashed_password is @encryptPassword password
  makeSalt: ->
    Math.round(new Date().valueOf() * Math.random()) + ''
  encryptPassword: (password) ->
    return '' if not password
    try
      encrypred = crypto.createHmac 'sha1', @salt
                  .update password
                  .digest 'hex'
    catch err
      ''
  addOrder: (order) ->
    @orders.push order._id
    @save (err) ->
      throw err if err

UserSchema.statics =
  load: (id, cb) ->
    @findOne _id: id
    .populate 'orders'
    .exec cb

mongoose.model 'User', UserSchema
