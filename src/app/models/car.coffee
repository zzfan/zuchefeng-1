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
  image:
    url128x128: String
    url256x256: String
  createdAt: type: Date, default: Date.now

CarSchema.methods =
  moveAndSave: (image, cb) ->
    self = this
    utils.moveImage image, 'public/img/upload/', (newFile) ->
      utils.thumbnailImage
        src: newFile
        target: 'public/img/thumbnail/128x128/'
        width: 128
        height: 128
        , (url) ->
          self.image.url128x128 = url.substr(6)
          utils.thumbnailImage
            src: newFile
            target: 'public/img/thumbnail/256x256/'
            width: 256
            heigtht: 256
            , (url) ->
              self.image.url256x256 = url.substr(6)
              self.save cb
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
