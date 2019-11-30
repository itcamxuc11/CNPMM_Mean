var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Classroom = new Schema({
    name: String,
    startdate: Date,
    enddate: Date
})

module.exports = mongoose.model('Classroom', Classroom);