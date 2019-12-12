var Question = require('../models/question');
var Exam = require('../models/exam');
var Classroom = require('../models/class');
var RelativeExam = require('../models/relative-exam');
const readXlsxFile = require('read-excel-file/node');
var Result = require('../models/result');
var config = require('../config');
var jwt = require('jsonwebtoken');
var supperSeceret = config.secret;
function readFileExam(filePath, title) {
    readXlsxFile(filePath).then((rows) => {
        var questionList = [];
        var n = rows.length;
        rows.forEach((row, index) => {
            var question = new Question();
            question.content = row[0];
            for (i = 1; i < row.length - 1; i++) {
                question.answer.push(row[i]);
            }
            question.correctAnswer = row[row.length - 1];
            question.save(function (err) {
                if (err) return console.log(err);
                questionList.push(question._id);
                if (index == n - 1) {
                    var exam = new Exam();
                    exam.name = title;
                    exam.questionList = questionList;
                    exam.save((err) => {
                        if (err) return console.log(err);
                    });
                }
            });
        });
    })
}

function addExam(req, res) {
    try {
        let file = req.files.file;
        name = file.name;
        file.mv(config.path + '/tmp/tmp.xlsx', function (err) {
            if (err) { console.log(err); return; }
            else {
                readFileExam(config.path + '/tmp/tmp.xlsx', name.substring(0, name.indexOf('.')));
                res.send('ok');
            }
        });
    }
    catch (err) {
        console.log(err);
    }
}

function getAllExam(req, res) {
    Exam.find(function (err, exams) {
        if (err) throw err;
        else res.json(exams);
    });
}

function deleteExam(req, res) {
    examId = req.params.exam_id;
    Exam.findOneAndRemove({ _id: examId }, (err) => {
        if (err) return console.log(err);
        else res.json('ok');
    })
}

function addExamToClass(req, res) {
    var examId = req.params.examId;
    var classId = req.body.classId;
    var title = req.body.title;
    var times = req.body.times;
    var start = req.body.start;
    var end = req.body.end;
    Exam.findById(examId, (err, exam) => {
        if (err) return console.log(err);
        else {
            var relative = new RelativeExam();
            relative.classroom = classId;
            relative.exam = examId;
            relative.title = title;
            relative.times = times;
            relative.start = start;
            relative.end = end;
            relative.save(err => {
                if (err) return console.log(err);
                Exam.findById(examId, (err, exam) => {
                    if (err) return console.log(err);
                    exam.relatives.push(relative._id);
                    exam.save(err => {
                        if (err) return console.log(err);
                        Classroom.findById(classId, (err, classroom) => {
                            if (err) return console.log(err);
                            classroom.exams.push(relative._id);
                            classroom.save(err => {
                                if (err) return console.log(err);
                                res.json('ok');
                            })
                        })
                    })
                })
            })
        }
    })
}

function removeExamFromClass(req, res) {
    var examId = req.params.exam_id;
    var classId = req.params.class_id;
    RelativeExam.find({
        exam: examId,
        classroom: classId
    }, (err, relative) => {
        if (err) return console.log(err + 'line 114');
        var relativeId = relative[0]._id;
        console.log(relativeId);
        RelativeExam.remove({
            _id: relativeId
        }, (err) => {
            if (err) return console.log(err);
            Exam.findOneAndUpdate(
                { _id: examId },
                { $pull: { relatives: relativeId } },
                (err) => {
                    if (err) return console.log(err);
                    Classroom.findOneAndUpdate(
                        { _id: classId },
                        { $pull: { exams: relativeId } },
                        (err) => {
                            if (err) return console.log(err);
                            res.json('ok');
                        }
                    )
                }
            )
        })
    })
}

function getDetail(req, res) {
    try {
        examId = req.params.examId;
        RelativeExam.find({ exam: examId }).populate('classroom').exec((err, docs) => {
            if (err) console.log(err);
            res.json(docs);
        })
    }
    catch (err) {
        console.log(err);
    }
}


function getExamContent(req, res) {
    relativeId = req.params.relativeId;
    var decoded = req.decoded;
    var userId = decoded.id;
    Result.find({ relative: relativeId, user: userId }, (err, his) => {
        if (err) return console.log(err);
        if (his.length > 0) return res.status(403).send("Bạn đã thực hiện bài thi này");
        else {
            RelativeExam.findById(relativeId).populate('exam').exec((err, docs) => {
                if (err) return console.log(err);
                var examId = docs.exam._id;
                var times = docs.times;
                docs.populate('exam.questionList').execPopulate((err, exam) => {
                    if (err) return console.log(err);
                    var result = new Result();
                    result.relative = exam._id;
                    result.exam = examId;
                    result.user = userId;
                    result.score = 0;
                    result.save((err) => {
                        if (err) return console.log(err);
                        var token = createToken(result._id, times);
                        res.json({
                            main: exam,
                            test_token: token
                        })
                    })
                })
            })
        }
    })
}

function markAnswerSheet(req, res) {
    examId = req.body.examId;
    answer = req.body.answer;
    token = req.body.testToken;
    if (token) {
        jwt.verify(token, supperSeceret, function (err, decoded) {
            if (err)
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            else {
                resultId = decoded.id;
                Exam.findById(examId).populate('questionList').exec((err, docs) => {
                    if (err) return console.log(err);
                    var count = 0;
                    var questionList = docs.questionList;
                    for (i = 0; i < questionList.length; i++) {
                        if (questionList[i].correctAnswer == answer[i]) count++;
                    }
                    var score = (count / questionList.length * 10).toFixed(2);
                    Result.findOneAndUpdate({
                        _id: resultId
                    },{
                        score: score
                    },(err)=>{
                        if(err) return console.log(err);
                        res.json(score);
                    })
                })
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}

function createToken(resultId, times) {
    return jwt.sign({
        id: resultId
    }, supperSeceret,
        {
            expiresIn: times * 60
        });
};

function getScore(req, res){
    examId = req.params.examId;
    Result.find({exam:examId},(err, docs)=>{
        if(err) return console.log(err);
        res.json(docs);
    })
}

module.exports.getAll = getAllExam;
module.exports.addExam = addExam;
module.exports.deleteExam = deleteExam;
module.exports.addExamToClass = addExamToClass;
module.exports.getDetail = getDetail;
module.exports.removeExamFromClass = removeExamFromClass;
module.exports.getExamContent = getExamContent;
module.exports.markAnswerSheet = markAnswerSheet;
module.exports.getScore = getScore;
