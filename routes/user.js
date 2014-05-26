
/*
 * GET users listing.
 */

var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
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

  app.get('/auth/google/return', passport.authenticate('google', { 
    successRedirect: 'http://' + secrets.hostname + ':' + secrets.port + '/#/profile',
    failureRedirect: 'http://' + secrets.hostname + ':' + secrets.port + '/' 
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id,done);
  });

  passport.use(new GoogleStrategy({
      returnURL: 'http://' + secrets.hostname + ':' + secrets.port + '/auth/google/return',
      realm: 'http://' + secrets.hostname + ':' + secrets.port
    },
    function(identifier, profile, done) {

      User.findOne({ email: profile.emails[0].value }, function(err, user) {
        if(user) {
          user.lastLogin = new Date()
          return user.save(done)
        } else {
          var user = new User({
            email: profile.emails[0].value,
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