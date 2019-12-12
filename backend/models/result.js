var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ResultSchema = new Schema({
    exam: {type:Schema.Types.ObjectId, ref:'Exam'},
    user: {type:Schema.Types.ObjectId, ref:'User'},
    relative:{type:Schema.Types.ObjectId, ref:'RelativeExam'},
    score: Number
})

module.exports = mongoose.model('Result',ResultSchema);