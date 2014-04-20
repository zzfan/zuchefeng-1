var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , User = mongoose.model('User')
  , Seller = mongoose.model('Seller')


module.exports = function (passport, config) {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser(function(user, done) {
    // here comes the obj in the following method, deserializeUser
    done(null, {id: user.id, type: user.type})
  })

  passport.deserializeUser(function(obj, done) {
	  if (obj.type == 'Seller') {
	      Seller.findOne({ _id: obj.id }, function (err, user) {
	        // this user is used in req.user?
          done(err, user)
	      })
	  }
	  else {
	      User.findOne({ _id: obj.id }, function (err, user) {
	        done(err, user)
	      })
	  }
  })

  // seller strategy
  passport.use('seller', new LocalStrategy({
	  usernameField: 'email',
	  passwordField: 'password'
  	},
	function(email, password, done) {
		Seller.findOne({ email: email }, function(err, seller) {
			if (err) { return done(err); }
			if (!seller) {
				return done(null, false, { message: 'Unknown Seller' })
			}
			if (!seller.authenticate(password)) {
				return done(null, false, { message: 'Invalid password' })
			}
      // here comes the seller, used by serializeUser
			return done(null, seller);
		})
	}
  ))

  // use local strategy
  passport.use('user', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          return done(null, false, { message: 'Unknown user' })
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Invalid password' })
        }
        return done(null, user)
      })
    }
  ))
}
