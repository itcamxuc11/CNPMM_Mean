var User = require('../models/user');
var Classroom = require('../models/class');
var Result = require('../models/result');

function createUser(req, res) {
    var user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;
    user.role = 1;
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
}

function getAllUser(req, res) {
    User.find({ role:1 }, function (err, users) {
        if (err) return console.log(err);
        else res.json(users);
    })
}

function getExamsOfUser(req, res) {
    var userId = req.params.user_id;
    console.log(userId);
    User.findById(userId, (err, user) => {
        if (err) return console.log(err);
        user.populate('classList').execPopulate((err, docs) => {
            if (err) return console.log(err);
            docs.populate('classList.exams').execPopulate((err, ex) => {
                if (err) return console.log(err);
                Result.find({user:userId}).populate('relative').exec((err, his)=>{
                    if(err) return console.log(err);
                    res.json({
                        main: ex,
                        history: his
                    })
                })
            })
        })
    })
}





module.exports.getAllUser = getAllUser;
module.exports.createUser = createUser;
module.exports.getExamsOfUser = getExamsOfUser;