var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ExamSchema = new Schema({
    name: String,
    questionList: [{type: Schema.Types.ObjectId, ref:'Question'}],
    relatives: [{type: Schema.Types.ObjectId, ref:'RelativeExam'}]
})

module.exports = mongoose.model('Exam',ExamSchema);