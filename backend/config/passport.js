
var configAuth = require('./auth');
var User = require('../models/user');
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleTokenStrategy = require('passport-google-token').Strategy;

function FbLogin(passport){
  passport.use(new FacebookTokenStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret
  },
  function (accessToken, refreshToken, profile, done) {
    User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
      return done(err, user);
    });
  }));
}

function GoogleLogin(passport){
  passport.use(new GoogleTokenStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret
  },
  function(accessToken, refreshToken, profile, done) {
    User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
      return done(err, user);
    });
  }
));
}

module.exports.FbLogin = FbLogin;
module.exports.GoogleLogin = GoogleLogin;
