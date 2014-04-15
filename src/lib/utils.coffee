###
utils
###
easyimage = require 'easyimage'
fs = require 'fs'

env = process.env.NODE_ENV || 'development'
config = require('../config/config')[env]

exports.moveToUpload = (file) ->
  src = file.path # '/var/xxx/xxx/ccc/xffsj.jpg'
  index = file.path.lastIndexOf '/'
  filename = file.path.substr index+1 # xffsj.jpg
  dst = config.imgUpload + filename # public/img/xxx/xx.jpg
  fs.rename src, dst, (err) ->
    throw err if err
  dst.substr(6) # /img/xxx/xx.jpg

resizeImage = (src) ->
  index = image.lastIndexOf '/'
  filename = image.substr index+1
  for [width, height] in config.imgSizes
    dst = "#{config.imgResize}#{height}x#{width}/#{filename}"
    easyimage.resize src, dst, width, heigth, (err) ->
      throw err if err

exports.getImageUrls = (file) ->
  index = file.path.lastIndexOf '/'
  filename = file.path.substr index+1
  # TODO delete the uploaded image
  for [width, height] in config.imgSizes
    key = "url#{width}x#{height}"
    value = "#{config.imgResize}#{height}x#{width}/#{filename}"
    _obj = {}
    _obj[key] = value
    _obj

exports.moveImage = (file, dst, cb) ->
  tmpPath = file.path
  index = file.path.lastIndexOf '/'
  filename = file.path.substr index+1
  targetPath = dst + filename
  fs.rename tmpPath, targetPath, (err) ->
    throw err if err
    cb targetPath

###
@param {Object} obj
{String} obj.src
{String} obj.target
{Integer} obj.width
{Integer} obj.height
###

exports.thumbnailImage = (obj, cb) ->
  index = obj.src.lastIndexOf '/'
  filename = obj.src.substr index+1
  dst = obj.target + filename
  easyimage.thumbnail
    src: obj.src
    dst: dst
    height: obj.height
    width: obj.width
    x: 0
    y: 0
    , (err, image) ->
      throw err if err
      cb dst

###
Formats mongoose errors into proper array
@param {Array} errors
@return {Array}
@api public
###

exports.errors = (errors) ->
  keys = Object.keys errors
  errs = []
  # if there is no validation error
  if not keys then return ['Oops! There was an error.']
  keys.forEach (key) ->
    errs.push errors[key].message
  errs

###
Index of object within an array
@param {Array} arr
@param {Object} obj
@return {Number}
@api public
###

exports.indexof = (arr, obj) ->
  index = -1 # not found initially
  keys = Object.keys obj
  # filter the collection with the given criterias
  result = arr.filter (doc, idx) ->
    # keep a counter of matched key/value pairs
    matched = 0
    # loop over criteria
    for i in [key.length..0]
      if doc[keys[i]] is obj[keys[i]]
        matched++
        # check if all criterias are matched
        if matched is keys.length
          index = idx
          return idx
  index

###
Find object in an array of objects that matches a condition
@param {Array} arr
@param {Object} obj
@param {Function} cb - optional
@return {Object}
@api public
###

exports.findByParam = (arr, obj, cb) ->
  index = exports.indexof(arr, obj)
  # ~index = not index ?
  if ~index and typeof cb is 'function'
    cb undefined, arr[index]
  else if ~index and not cb
    arr[index]
  else if !~index and typeof cb is 'function'
    cb 'not found'
  # else undefined is returned
