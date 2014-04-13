/**
 * Controller for cars
 *
 * @param
 * @returns
 */
 
var mongoose = require('mongoose')
    , Car = mongoose.model('Car')
    , Order = mongoose.model('Order')
    , utils = require('../../lib/utils')
    , extend = require('util')._extend;

exports.load = function(req, res, next, id) {
    Car.load(id, function(err, car) {
        if (err) return next(err);
        if (!car) return next(new Error('not found'));
        //This is where the req.car becomes available
        req.car = car;
        next();
    });
};

exports.new = function(req, res) {
    res.render('cars/new', {
        title: '添加新车',
        car: new Car()
    });
};

exports.create = function(req, res) {
    var car = new Car(req.body);
    car.seller = req.user;
    var cb = function(err) {
        if (err) {
            exports.edit(req, res);
        }
        req.flash('info', '成功创建新车');
		// callback required?? what's true 无阻塞? 这里会不会阻塞
		req.user.addCar(car._id);
        return res.redirect('/cars/'+car._id);
    };
    if (req.files.image.originalFilename) {
        car.moveAndSave(req.files.image, cb);
    } else {
        car.save(cb);
    }
};

exports.index = function(req, res) {
    var page = (req.param('page')>0 ? req.param('page') : 1) -1;
    var perPage = 30;
    var options = {
        perPage: perPage,
        page: page
    };
    Car.list(options, function(err, cars) { //TODO in model
        if (err) return res.render('500');
        Car.count().exec(function(err, count) {
            res.render('cars/index', {
                title: '单车列表',
                cars: cars,
                page: page + 1,
                pages: Math.ceil(count/perPage)
            });
        });
    });
};

exports.edit = function(req, res) {
    res.render('cars/edit', {
        title: '更新车辆信息',
        car: req.car
    });
};

exports.update = function(req, res) {
    var car = req.car;
    car = extend(car, req.body);
    var cb = function(err) {
        if (err) {
            exports.edit(req, res);
        }
        return res.redirect('/cars/'+car._id);
    };
    if (req.files.image.originalFilename) {
        car.moveAndSave(req.files.image, cb);
    } else {
        car.save(cb);
    }
};

exports.show = function(req, res) {
    res.render('cars/show', {
        title: req.car.title,
        car: req.car,
        user: req.user
    });
};

exports.destroy = function(req, res) {
    var car = req.car;
    car.remove(function(err) { //TODO ?
        req.flash('info', 'Deleted Successfully');
        res.redirect('/cars');
    });
};

exports.order = function(req, res) {
    res.render('cars/order', {
        title: '订单确认',
        car: req.car,
        user: req.user
    });
};

exports.createOrder = function(req, res) {
    var cb = function(err) {
        //TODO res.render?
        if (err) {
            res.render('500');
        }
        res.redirect('/');
    };
    cb = function(err) {
        if (err) {
            throw err;
        }
    }
    var order = new Order(req.body);
    // order save
    order.buyer = req.user;
    order.car = req.car;
    order.save(cb);

	req.car.addOrder(order._id);
	req.user.addOrder(order._id);
    res.redirect('/');
};
