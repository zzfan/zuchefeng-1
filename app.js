
/*!
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , passport = require('passport')

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
// hbcmt 'test' or 'development'
// hbcmt process is set using commandline: NODE_ENV=test node server.js
var env = process.env.NODE_ENV || 'development' //hbcmt process is global
  , config = require('./config/config')[env]
  , mongoose = require('mongoose')

// Bootstrap db connection
// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } }
  mongoose.connect(config.db, options)
}
connect()

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err)
})

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect()
})

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

// bootstrap passport config
require('./config/passport')(passport, config)

var app = express()
// express settings
require('./config/express')(app, config, passport)

// Bootstrap routes
require('./config/routes')(app, passport)

// Start the app by listening on <port>
var port = process.env.PORT || 3000
app.listen(port)
console.log('Express app started on port '+port)

// expose app
exports = module.exports = app
