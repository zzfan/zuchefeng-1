/**
 * @file route.js
 */
var async = require('async')

var users = require('../app/controllers/users')
	, sellers = require('../app/controllers/sellers')
    , cars = require('../app/controllers/cars')
    , auth = require('./middlewares/authorization')

var userAuth = [auth.requiresLogin, auth.user.hasAuthorization]
var carAuth = [auth.requiresLogin, auth.car.hasAuthorization]
var sellerAuth = [auth.requiresLogin, auth.requiresSeller]

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


    app.get('/cars', cars.index);
    app.get('/cars/new', sellerAuth, cars.new);
    app.post('/cars', auth.requiresLogin, cars.create);
    app.get('/cars/:carId', cars.show);
    app.get('/cars/:carId/edit', carAuth, cars.edit);
    app.put('/cars/:carId', carAuth, cars.update);
    app.del('/cars/:carId', carAuth, cars.destroy);

    app.get('/cars/:carId/order', auth.requiresLogin, cars.order);
    app.post('/cars/:carId/order', auth.requiresLogin, cars.createOrder);
}
