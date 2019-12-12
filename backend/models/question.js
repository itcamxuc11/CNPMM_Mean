var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    content: String,
    answer: Array,
    correctAnswer:String
})

module.exports = mongoose.model('Question', QuestionSchema);