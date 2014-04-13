/**
 * @file models/seller.js
 *
 * This file define model of sellers.
 */
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , crypto = require('crypto')
    , utils = require('../../lib/utils')

var SellerSchema = new Schema({
    name: {type: String, default: ''},
    company: {
    	name: { type: String, default: ''},
		addr: { type: String, default: ''},
		subname: { type: String, default: ''},
		desc: { type: String, default: ''}
    },
	//TODO check validation of phone numbers
	fix: { type: String, default: ''},
	mobile: { type: String, default: ''},
	type: {type: String, default: 'Seller'},
    email: {type: String, default: ''},
    hashed_password: {type: String, default: ''},
    salt: {type: String, default: ''},
	cars: [{
		type: Schema.ObjectId, ref: 'Car'
	}],
	image: {
    url128x128: {type: String, default: ''},
    url256x256: { type: String, default: ''}
  }
});

SellerSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    }).get(function() {
        return this._password;
    });

SellerSchema.methods = {
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
	addCar: function(carId) {
		this.cars.push(carId);
		this.save(function(err) {
			if (err) throw err;
		});
	},
  moveAndSave: function(image, cb) {
    var self = this;
    utils.moveImage(image, 'public/img/upload/', function(newFile) {
      utils.thumbnailImage({
        src: newFile,
        target: 'public/img/thumbnail/128x128/', //the last '/' is must
        width: 128,
        height: 128
      }, function(url) {
        self.image.url128x128 = url.substr(6); //get rid of public
        //TODO let these 2 thumbnail 同时do
        //generate another 256x256 image
        utils.thumbnailImage({
          src: newFile,
          target: 'public/img/thumbnail/256x256/',
          width: 256,
          height: 256
        }, function(url) {
          self.image.url256x256 = url.substr(6);
          self.save(cb);
        });
      });
    });
  }
};
SellerSchema.statics = {
    load: function(id, cb) {
        this.findOne({_id: id})
			.populate('cars')
            .exec(cb);
    }
};
mongoose.model('Seller', SellerSchema);
