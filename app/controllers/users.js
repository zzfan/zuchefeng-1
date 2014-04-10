/**
 * @file controllers/users.js
 */

var mongoose = require('mongoose')
    , User = mongoose.model('User')
    , utils = require('../../lib/utils');

exports.login = function(req, res) {
    res.render('users/login', {
        title: '登录',
        message: req.flash('error')
    });
};

exports.signup = function(req, res) {
    res.render('users/signup', {
        title: '注册',
        user: new User()
    });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/login');
};

exports.session = function(req, res) { //TODO ?
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
};

exports.create = function(req, res) {
    var user = new User(req.body);
	//防止客户构造post数据，进行seller注册 TODO
	user.type = 'buyer';
    user.save(function(err) {
        if (err) {
            return res.render('users/signup', {
                user: user,
                title: '注册'
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err); //TODO ?
            return res.redirect('/');
        });
    });
};

exports.load = function(req, res, next, id) {
    User.load(id, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('failed to load user'));
        req.profile = user;
        next();
    });
};

exports.show = function(req, res) {
    var user = req.profile;
	//我的个人中心
	if (req.user._id.toString() == user._id.toString()) {
		res.render('users/show', {
			title: '我的个人中心',
			user: user
		});
	}
	//查看别的用户
	else {
		;
	}
};
