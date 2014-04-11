/**
 * @file models/user.js
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , crypto = require('crypto')
    , utils = require('../../lib/utils')

var UserSchema = new Schema({
    name: {type: String, default: ''},
    email: {type: String, default: ''},
    hashed_password: {type: String, default: ''},
    salt: {type: String, default: ''},
	// buyer or seller
	type: {type: String, default: 'buyer'},
    orders: [{
        type: Schema.ObjectId, ref: 'Order'
    }],
	cars: [{
		type: Schema.ObjectId, ref: 'Car'
	}],
	image: { type: String, default: ''}
});

UserSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    }).get(function() {
        return this._password;
    });

UserSchema.methods = {
    authenticate: function(password) {
        return this.encryptPassword(password) === this.hashed_password;
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    encryptPassword: function(password) {
        if (!password) return '';
        var encrypred;
        try {
            encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            return encrypred;
        } catch(err) {
            return '';
        }
    },
	addOrder: function(orderId) {
		this.orders.push(orderId);
		this.save(function(err) {
			if (err) throw err;
		});
	}
};
UserSchema.statics = {
    load: function(id, cb) {
        this.findOne({_id: id})
            .populate('orders')
            .exec(cb);
    }
};
mongoose.model('User', UserSchema);
