var User = require('../models/user');
var Classroom = require('../models/class');
var jwt = require('jsonwebtoken');
var config = require('../config/auth');
const fileUpload = require('express-fileupload');
var examController = require('../controllers/exam-controller');
var classController = require('../controllers/class-controller');
var userController = require('../controllers/user-controller');
var Exam = require('../models/exam');
var superSecret = config["supper-seceret"];


module.exports = function (app, express) {
    var apiRouter = express.Router();
    apiRouter.use(fileUpload());
    
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

    // on routes that end in /users
    apiRouter.route('/users')
        .post(function (req, res) {
            userController.createUser(req, res);
        })
        .get(function (req, res) {
            userController.getAllUser(req,res);
        });

    apiRouter.route('/users/:user_id')
        .get(function (req, res) {
            userController.getExamsOfUser(req,res);
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
        classController.createClass(req, res);
    })
    .get(function (req, res) {
        classController.getAllClass(req, res);
    });

    apiRouter.route('/classroom/:class_id')
    .get(function (req, res) {
        Classroom.findById(req.params.class_id, function (err, classroom) {
            if (err) res.send(err);
            else res.json(classroom);
        })
    })
    .put(function (req, res) {
        classController.updateClass(req, res);
    })
    .delete(function (req, res) {
        classController.deleteClass(req, res);
    });

    apiRouter.route('/classroom/detail/:class_id')
    .get(function(req,res){
        classController.getAllUserOfClass(req, res);
    });
    apiRouter.route('/classroom/detail/:class_id/:user_id')
    .post(function(req, res){
        classController.addStudentToClass(req, res);
    })
    .delete(function(req, res){
        classController.removeStudentFromClass(req,res);
    });

    //Exam
    apiRouter.route('/exams')
    .post(function(req, res){
        examController.addExam(req, res);
    })
    .get(function(req, res){
        examController.getAll(req, res);
    });
    apiRouter.route('/exam/:exam_id')
    .delete((req, res)=>{
        examController.deleteExam(req, res);
    })
    apiRouter.route('/exam/detail/:examId')
    .post(function(req, res){
        examController.addExamToClass(req, res);
    })
    .get(function(req, res){
        examController.getDetail(req, res);
    })
    .put(function(req,res){
        examController.upDateRelative(req, res);
    });

    apiRouter.delete('/exam/detail/:exam_id/:class_id', function(req, res){
        examController.removeExamFromClass(req, res);
    })

    apiRouter.get('/test/:relativeId',function(req,res){
        examController.getExamContent(req,res);
    })

    apiRouter.post('/test/marker', function(req, res){
        examController.markAnswerSheet(req,res);
    })

    apiRouter.get('/test/result/:examId', function(req, res){
        examController.getScore(req, res);
    })
    return apiRouter;
};
