###
model for cars
###

mongoose = require 'mongoose'
Schema = mongoose.Schema
utils = require '../../lib/utils'
helpers = require '../../config/helpers'

CarSchema = new Schema
  name: type: String, default: ''
  seller: type: Schema.ObjectId, ref: 'Seller'
  brand: type: String, default: ''
  number: type: String, default: ''
  price: type: Number, default: -1
  desc: type: String, default: '', trim: true
  detail: type: String, default: ''
  orders: [ type: Schema.ObjectId, ref: 'Order']
  pastOrders: [ type: Schema.ObjectId, ref: 'Order']
  ratings: [
    user: type: Schema.ObjectId, ref: 'User'
    order: type: Schema.ObjectId, ref: 'Order'
    comment: type: String, default: ''
    point: type: Number, default: -1
  ]
  image: type: String, default: ''
  createdAt: type: Date, default: Date.now

CarSchema.methods =
  addImageUrl: (url, cb) ->
    cb = if cb? then cb else (err) ->
      throw err if err
    @image = url
    @save cb
  addOrder: (order) ->
    @orders.push order._id
    @save (err) ->
      throw err if err

CarSchema.statics =
  load: (id, cb) ->
    User = mongoose.model('User')
    @findOne({_id:id})
      .populate('seller')
      .populate('orders')
      .exec (err, docs) ->
        if err
          throw err
        else
          User.populate docs.orders, 'seller buyer', (err, docs2) ->
            cb err, docs
  list: (options, cb) ->
    criteria = options.criteria or {}
    @find(criteria)
      .populate('seller')
      .sort({'createdAt': -1})
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec cb

mongoose.model 'Car', CarSchema
