var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require('./auth');
var User = require('../models/user');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    //Login by facebook
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
    },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                console.log("Day la token: " + token);
                User.findOne({ 'username': profile.emails[0].value }, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        console.log('Da dang nhao');
                        return done(null, user); // user found, return that user
                    } else {
                        console.log(token);

                        // nếu chưa có, tạo mới user
                        var newUser = new User();
                        // lưu các thông tin cho user

                        newUser.username = profile.emails[0].value;
                        newUser.name = profile.displayName;
                        // lưu vào db
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            // nếu thành công, trả lại user
                            console.log('Da luu');
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    //login by google
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({ 'username': profile.emails[0].value}, function (err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        newUser.username = profile.emails[0].value;
                        newUser.name = profile.displayName;
                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};