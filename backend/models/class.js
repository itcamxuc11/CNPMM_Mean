var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    username: {type:String, require: true, index :{unique:true}},
    password:{type:String, select:false}
})

UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function(ree, hash){
        user.password = hash;
        next();
    })
})

UserSchema.methods.comparePassword = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
}

module.exports = mongoose.model('Class', UserSchema);