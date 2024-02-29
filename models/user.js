const mongoose = require("mongoose");
exports.UserSchema = function (mongoose) {
    const userSchema = new mongoose.Schema({
        fullName: String,
        email: String,
        password: String,
        isAdmin: {
            type: Boolean,
            default: false
        },
        currency: String,
        resetToken: String,
    });
    userSchema.options.toJSON = {
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    };
    return mongoose.model('user', userSchema);
}
