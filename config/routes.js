/**
* @file route.js
*/
var async = require('async')

var users = require('../app/controllers/users')
, sellers = require('../app/controllers/sellers')
, cars = require('../app/controllers/cars')
, auth = require('./middlewares/authorization')
, utils = require('../lib/utils.js')

//验证地址中的userId和req.user是不是一个人
var userAuth = [auth.requiresLogin, auth.user.hasAuthorization]
// 验证地址中的carId.seller是不是req.user
var carAuth = [auth.requiresLogin, auth.car.hasAuthorization]
// 验证地址中的sellerId和req.user是一个人
var sellerAuth = [auth.requiresLogin, auth.seller.hasAuthorization]

module.exports = function (app, passport) {
  app.get('/', cars.index);
  app.param('userId', users.load);
  app.param('carId', cars.load);
  app.param('sellerId', sellers.load);

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
  passport.authenticate('user', {
    failureRedirect: '/login',
    failureFlash: 'Invalid email or password.'
  }), users.session);
  app.get('/users/:userId', users.show);

  // sellers
  app.get('/sellers/signup', sellers.signup)
  app.post('/sellers', sellers.create);
  app.get('/sellers/login', sellers.login);
  app.get('/sellers/:sellerId', sellers.show);
  app.post('/sellers/session',
    passport.authenticate('seller', {
      failureRedirect: '/sellers/login',
      failureFlash: 'Invalid email or password'
    }), sellers.session
  );
  app.get('/sellers/:sellerId', sellers.show);
  app.get('/sellers/:sellerId/dashboard', sellers.dashboard);
  app.get('/sellers/:sellerId/edit', sellerAuth, sellers.edit);
  app.post('/sellers/:sellerId', sellerAuth, sellers.update);
  app.post('/sellers/:sellerId/head', sellerAuth, sellers.head);



  app.get('/cars', cars.index);
  app.get('/cars/new', auth.requiresSeller, cars.new);
  app.post('/cars', auth.requiresLogin, cars.create);
  app.get('/cars/:carId', cars.show);
  // get 'edit car' page
  app.get('/cars/:carId/edit', carAuth, cars.edit);
  // get 'edit detail' page
  app.get('/cars/:carId/detail', carAuth, cars.detail);
  // put content to server, and return something
  app.put('/cars/:carId/detail', carAuth, cars.updateDetail);
  // put to server, update car
  app.put('/cars/:carId', carAuth, cars.update);
  // del car from server
  app.del('/cars/:carId', carAuth, cars.destroy);

  app.get('/cars/:carId/order', auth.requiresLogin, cars.order);
  app.post('/cars/:carId/order', auth.requiresLogin, cars.createOrder);

  app.get('/find/img/upload/:img/:size', utils.getImage);


};
