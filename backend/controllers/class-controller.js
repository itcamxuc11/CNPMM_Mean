var User = require('../models/user');
var Classroom = require('../models/class');

function createClass(req, res) {
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
}

function getAllClass(req, res) {
    Classroom.find(function (err, classrooms) {
        if (err) res.send(err);
        res.json(classrooms);
    });
}

function updateClass(req, res) {
    Classroom.findById(req.params.class_id, function (err, classroom) {
        if (err) return res.send(err);
        if (req.body.name) classroom.name = req.body.name;
        if (req.body.enddate) classroom.enddate = req.body.enddate;
        classroom.save(function (err) {
            if (err) res.send(err);
            res.json({ message: 'Class updated!' });
        });
    });
}

function deleteClass(req, res) {
    Classroom.remove({
        _id: req.params.class_id
    }, function (err, classroom) {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted' });
    });
}

function getAllUserOfClass(req, res) {
    var classId = req.params.class_id;
    Classroom.findById(classId, function (err, doc) {
        if (err) {
            console.log(err);
            return;
        }
        else {
            if (doc != null) {
                doc.populate('students').execPopulate(function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    else {
                        return res.json(result.students);
                    }
                })
            }
        }
    });
}

function addStudentToClass(req, res) {
    classId = req.params.class_id;
    userId = req.params.user_id;
    Classroom.findById(classId, function(err,doc){
        if(err) return console.log(err);
        doc.students.push(userId);
        doc.save(function(err){
            if(err) return console.log(err);
        })
    })
    User.findById(userId, function(err, doc){
        if(err) return console.log(err);
        doc.classList.push(classId);
        doc.save(function(err){
            if(err) return console.log(err);
            return res.json('ok');
        })
    })
}

function removeStudentFromClass(req, res) {
    classId = req.params.class_id;
    userId = req.params.user_id;
    console.log(classId);
    Classroom.findById(classId, function (err, doc) {
        if (err) {
            return console.log(err);
        }
        else {
            var i = doc.students.indexOf(userId);
            if (i > -1) {
                doc.students.splice(i);
                doc.save();
                return res.json('ok');
            }
            else console.log(userId);
        }
    });
    User.findById(userId, function(err, doc){
        if(err) return console.log(err);
        else{
            var i = doc.classList.indexOf(classId);
            if (i > -1) {
                doc.students.splice(i);
                return res.json('ok');
            }
            else console.log(userId);
        }
    })
}


module.exports.createClass = createClass;
module.exports.getAllClass = getAllClass;
module.exports.updateClass = updateClass;
module.exports.deleteClass = deleteClass;
module.exports.getAllUserOfClass = getAllUserOfClass;
module.exports.addStudentToClass = addStudentToClass;
module.exports.removeStudentFromClass = removeStudentFromClass;