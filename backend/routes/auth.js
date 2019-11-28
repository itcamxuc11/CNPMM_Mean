var jwt = require('jsonwebtoken');
var config = require('../config/auth');

var supperSeceret = config["supper-seceret"];

module.exports = function (app, express, passport) {

  var createToken = function (auth) {
    return jwt.sign({
      id: auth.id
    }, supperSeceret,
      {
        expiresIn: 60 * 120
      });
  };

  var generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    next();
  };

  var sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    res.status(200).send(req.auth);
  };

  var authRouter = express.Router();

    // Đăng nhập bằng google
    authRouter.route('/google')
    .post(passport.authenticate('google-token', { session: false }), function (req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }
      // prepare token for API
      console.log(req.user.username)
      req.auth = {
        id: req.user.id
      };
      next();
    }, generateToken, sendToken);



  //Đăng nhạp bằng facebook
  authRouter.route('/facebook')
    .post(passport.authenticate('facebook-token', { session: false }), function (req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }
      // prepare token for API
      req.auth = {
        id: req.user.id
      };
      next();
    }, generateToken, sendToken);

    return authRouter;
}
