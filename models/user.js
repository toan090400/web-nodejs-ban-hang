var mongoose = require('mongoose');
// User Schema
var UserSchema = mongoose.Schema({
    // Thêm tài khoản bằng username && password
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    admin: {
        type: Number
    },
    // Thêm tài khoản bằng Google

    googleId: {
        type: String,
    },
    displayName: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    image: {
        type: String,
    },

},{
    timestamps: true,
});

var User = module.exports = mongoose.model('User', UserSchema);