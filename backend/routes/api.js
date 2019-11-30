var User = require('../models/user');
var Classroom = require('../models/class');
var jwt = require('jsonwebtoken');
var config = require('../config/auth');
//const cookieParser = require('cookie-parser');

var superSecret = config["supper-seceret"];

module.exports = function (app, express) {

    var apiRouter = express.Router();
   // apiRouter.use(cookieParser());
    apiRouter.post('/authenticate', function (req, res) {
        console.log(req.body.username);
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {

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
                    var token = jwt.sign({
                        name: user.name,
                        username: user.username
                    }, superSecret, {
                        expiresIn: '90d' 
                    });
                    console.log(token);
                    res.cookie('access_token', token, {
                        maxAge: 90 * 24 * 3600 * 100, //90 ngay
                        httpOnly: true,
                        //secure: true;
                    })
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    });

    /*
    apiRouter.use(function (req, res, next) {
        console.log('Somebody just came to our app!');
        var token =  req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err)
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                else
                    req.decoded = decoded;
            });

        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
        next(); 
    });
    */
    apiRouter.get('/', function (req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    // on routes that end in /users
    apiRouter.route('/users')
        .post(function (req, res) {
            var user = new User();      
            user.name = req.body.name;  
            user.username = req.body.username;  
            user.password = req.body.password;  
            user.save(function (err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({ success: false, message: 'A user with that username already exists. ' });
                    else
                        return res.send(err);
                }
                res.json({ message: 'User created!' });
            });

        })

        .get(function (req, res) {
            User.find(function (err, users) {
                if (err) res.send(err);
                res.json(users);
            });
        });

    apiRouter.route('/users/:user_id')
        .get(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);
                res.json(user);
            });
        })
        .put(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err) res.send(err);
                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;
                // save the user
                user.save(function (err) {
                    if (err) res.send(err);
                    // return a message
                    res.json({ message: 'User updated!' });
                });

            });
        })
        // delete the user with this id
        .delete(function (req, res) {
            User.remove({
                _id: req.params.user_id
            }, function (err, user) {
                if (err) res.send(err);
                res.json({ message: 'Successfully deleted' });
            });
        });



    //Classroom
    apiRouter.route('/classroom')
    .post(function (req, res) {
        var classroom = new Classroom();      
        classroom.name = req.body.name;  
        classroom.startdate = req.body.startdate;
        classroom.enddate = req.body.enddate;
        classroom.save(function (err) {
            if (err) {
                return res.send(err);
            }
            res.json({ message: 'Classroom created!' });
        });
    })
    .get(function (req, res) {
        Classroom.find(function (err, classrooms) {
            if (err) res.send(err);
            res.json(classrooms);
        });
    });

apiRouter.route('/classroom/:class_id')
    .get(function (req, res) {
        Classroom.findById(req.params.class_id, function (err, classroom) {
            if (err) res.send(err);
            res.json(classroom);
        });
    })
    .put(function (req, res) {
        Classroom.findById(req.params.class_id, function (err, classroom) {
            if (err) return res.send(err);
            if (req.body.name) classroom.name = req.body.name;
            if (req.body.enddate) classroom.enddate = req.body.enddate;
            classroom.save(function (err) {
                if (err) res.send(err);
                res.json({ message: 'Class updated!' });
            });
        });
    })
    .delete(function (req, res) {
        Classroom.remove({
            _id: req.params.class_id
        }, function (err, classroom) {
            if (err) res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });
    return apiRouter;
};
