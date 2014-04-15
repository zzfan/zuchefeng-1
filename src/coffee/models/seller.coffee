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
  image:
    url128x128: type: String, default: ''
    url256x256: type: String, default: ''

SellerSchema.virtual('password')
.set (password) ->
  @_password = password
  @salt = @makeSalt()
  @hashed_password = @encryptPassword(password)
.get ->
  @_password

SellerSchema.methods =
  authenticate: (password) ->
    @encryptPassword password is @hashed_password
  makeSalt: ->
    Math.round(new Date()).valueOf() * Math.random() + ''
  encryptPassword: (password) ->
    return '' if not password
    try
      encrypred = crypto.createHmac('sha1', @salt)
                        .update(password).digest('hex')
    catch err
      ''
  addCar: (car) ->
    @cars.push(car._id)
    @save (err) ->
      throw err if err
  moveAndSave: (image, cb) ->
    self = this
    utils.moveImage image, 'public/img/upload/', (newFile) ->
      utils.thumbnailImage
        src: newFile
        target: 'public/img/thumbnail/128x128/'
        width: 128
        height: 128
        , (url) ->
          self.image.url128x128 = url.substr 6
          utils.thumbnailImage
            src: newFile
            target: 'public/img/thumbnail/'
            width: 256
            height: 256
            , (url) ->
              self.image.url256x256 = url.substr 6
              self.save cb

SellerSchema.statics =
  load: (id, cb) ->
    @findOne _id: id
    .populate 'cars'
    .exec cb

mongoose.model 'Seller', SellerSchema
