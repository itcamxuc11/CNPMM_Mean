var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Classroom = new Schema({
    name: String,
    startdate: Date,
    enddate: Date,
    students: [{type: Schema.Types.ObjectId, ref: 'User'}],
    exams: [{type: Schema.Types.ObjectId, ref:'RelativeExam'}]
})

module.exports = mongoose.model('Classroom', Classroom);