// var Page = require('../models/page');
// var User = require('../models/user');
var { check } = require('express-validator');


var Pages = {
    // Read Admin Pages
    CheckAdminPages: [

        check('title')
            .isLength({min:5})
            .withMessage(' Title ít nhất 5 ký tự')
            .isLength({max:20})
            .withMessage(' Title tối đa 20 ký tự')
            .matches(/^[a-zA-Z0-9]/)
            .withMessage(' Title không chứa ký tự đặc biệt'),
        check('content')
            .isLength({min:5})
            .withMessage(' Content ít nhất 5 ký tự')
            .isLength({max:20})
            .withMessage(' Content tối đa 20 ký tự')
            .matches(/^[A-Za-z0-9]/)
            .withMessage(' Content không chứa ký tự đặc biệt'),
    
    ],
    
}
module.exports = Pages;