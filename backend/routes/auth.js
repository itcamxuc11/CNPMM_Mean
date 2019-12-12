var jwt = require('jsonwebtoken');
var config = require('../config/auth');
var User = require('../models/user');

var supperSeceret = config["supper-seceret"];

module.exports = function (app, express, passport) {

  var createToken = function (auth) {
    return jwt.sign({
      id: auth.id,
      role: auth.role
    }, supperSeceret,
      {
        expiresIn: 60 * 5
      });
  };

  var generateToken = function (req, res, next) {
    req.token = createToken(req.user);
    next();
  };

  var sendToken = function (req, res) {
    res.json({
      token:req.token,
      id: req.user._id,
      role: req.user.role,
      name: req.user.name
    })
  };

  var authRouter = express.Router();

  authRouter.post('/local', function (req, res) {
    User.findOne({
      username: req.body.username
    }).select('_id name username password role').exec(function (err, user) {
      if (err) throw err;
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {
          var token = createToken(user);
          res.json({
            token: token,
            id:user._id,
            role: user.role,
            name: user.name
          })
        }
      }
    });
  });

  // Đăng nhập bằng google
  authRouter.route('/google')
    .post(passport.authenticate('google-token', { session: false }), function (req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }
      console.log(req.user.username);
      next();
    }, generateToken, sendToken);



  //Đăng nhạp bằng facebook
  authRouter.route('/facebook')
    .post(passport.authenticate('facebook-token', { session: false }), function (req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }
      // prepare token for API
      next();
    }, generateToken, sendToken);

  return authRouter;
}
