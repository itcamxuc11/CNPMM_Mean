var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    name: String,
    username: { type: String, require: true, index: { unique: true } },
    password: { type: String, select: false },
    role: Number,
    classList: [{type:Schema.Types.ObjectId, ref: 'Classroom'}],
    score: [Schema.Types.ObjectId]
})

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, function (ree, hash) {
        user.password = hash;
        next();
    })
})

UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
}

UserSchema.statics.upsertFbUser = function (accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
        'username': profile.emails[0].value
    }, function (err, user) {
        if (!user) {
            var newUser = new that({
                name: profile.displayName,
                role: 1,
                username: profile.emails[0].value,
            });
            newUser.save(function (error, savedUser) {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });
        } else {
            return cb(err, user);
        }
    });
};

module.exports = mongoose.model('User', UserSchema);