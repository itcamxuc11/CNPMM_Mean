var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RelativeExam = new Schema({
    exam: {type:Schema.Types.ObjectId, ref:'Exam'},
    classroom:{type:Schema.Types.ObjectId, ref:'Classroom'},
    title: String,
    times: String,
    start: String,
    end: String
})

module.exports = mongoose.model('RelativeExam', RelativeExam);