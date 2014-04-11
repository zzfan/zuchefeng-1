/**
 * @file controllers/sellers.js
 */

var mongoose = require('mongoose')
	, Seller = mongoose.model('Seller')
	, User = mongoose.model('User')
    , utils = require('../../lib/utils')
	, extend = require('util')._extend;

exports.login = function(req, res) {
    res.render('sellers/login', {
        title: '公司用户登录',
        message: req.flash('error')
    });
};

exports.signup = function(req, res) {
    res.render('sellers/signup', {
        title: '公司用户注册',
        user: new Seller()
    });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/login');
};

exports.session = function(req, res) { //TODO ?
	console.log(req.session);
	console.log(req.isAuthenticated());
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
};

exports.create = function(req, res) {
    var seller = new Seller(req.body);
	seller.type = 'Seller';
    seller.save(function(err) {
        if (err) {
            return res.render('sellers/signup', {
                user: seller,
                title: '公司用户注册'
            });
        }
        req.logIn(seller, function(err) {
            if (err) {
				return next(err); //TODO ?
			}
            return res.redirect('/');
        });
    });
};

exports.edit = function(req, res) {
	res.render('sellers/edit', {
		user: req.user,
		title: '编辑用户信息'
	});
}

var convert = function(obj) {
	return {
		company: {
			name: obj.companyName,
			subname: obj.companySubname,
			addr: obj.companyAddr,
			desc: obj.conpanyDesc
		},
		fix: obj.fix,
		mobile: obj.mobile
	};
};

exports.update = function(req, res) {
	var seller = req.profile;
	seller = extend(seller, convert(req.body));
	console.log(seller);
	seller.save(function(err) {
		if (err) throw err;
		req.flash('success', 'update success')
		return res.redirect('/sellers/'+seller._id+'/dashboard')
	});
}

exports.load = function(req, res, next, id) {
    Seller.load(id, function(err, seller) {
        if (err) return next(err);
        if (!seller) return next(new Error('failed to load user'));
        req.profile = seller;
        next();
    });
};

exports.dashboard = function(req, res) {
	//我的个人中心
	if (req.user._id.toString() == req.profile._id.toString()) {
		res.render('sellers/dashboard', {
			title: '公司控制面板',
			user: req.profile
		});
	}
	//查看别的用户
	else {
		;
	}
};
exports.show = function(req, res) {
	res.render('sellers/show', {
		title: '公司详情',
		user: req.profile
	});
}
