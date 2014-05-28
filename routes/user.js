
/*
 * GET users listing.
 */

var passport = require('passport');
var GooglePlusStrategy = require('passport-google-plus');
var secrets = require('../secrets')
var mongoose = require("mongoose")
var User = require("../models/user")

console.info({
  returnURL: 'http://' + secrets.hostname + ':' + secrets.port + '/auth/google/return',
  realm: 'http://' + secrets.hostname + ':' + secrets.port
});

function init(app) {
  
  app.get('/me', function(req, res) {
    if (req.user)
      return res.json(req.user)

    res.send(404)
  })

  app.get('/auth/google', passport.authenticate("google"));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('http://' + secrets.hostname + ':' + secrets.port);
  });

  app.post('/auth/google/return', passport.authenticate('google'), function(req, res) {
    res.redirect('/#/profile') 
  });

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id,done);
  });

  passport.use(new GooglePlusStrategy({
    clientId: secrets.GOOGLE_PLUS_CLIENT_ID,
    clientSecret: secrets.GOOGLE_PLUS_CLIENT_SECRET
  }, function(token, profile, done) {
   // console.log(token, profile)
      User.findOne({ email: profile.email}, function(err, user) {
        if(user) {
          user.lastLogin = new Date()
          return user.save(done)
        } else {
          var user = new User({
            email: profile.email,
            name: profile.displayName,
            firstLogin: new Date()
          });
          user.save(function(err, newUser) {
            if (err) throw err;
            console.log(newUser)
            done(null, newUser);
          });

        }
      });
    }
  ));
}

exports.init = init