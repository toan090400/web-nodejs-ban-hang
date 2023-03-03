var express = require('express');
var router = express.Router();
var { check, validationResult } = require('express-validator');


var bcrypt = require('bcryptjs');

var admin = require('../config/admin');
var isAdmin = admin.isAdmin;
// Get Account module
var Account = require('../models/user');

// Get accounts index
router.get('/',isAdmin, function (req, res) {
    Account.find({},function (err, accounts) {
        res.render('admin/accounts', {
            accounts: accounts
        });
    });
});

// Get add account

router.get('/add-account',isAdmin ,function(req,res) {
    res.render('admin/add_account');
});

/*
 * POST account
 */
router.post('/add-account',[
    check('name')
        .isLength({min:5})
        .withMessage(' User ít nhất 5 ký tự')
        .isLength({max:20})
        .withMessage(' User tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' User không chứa ký tự đặc biệt'),
    check('email')
        .isEmail()
        .withMessage(' Chỉ nhận Email'),
    check('username')
        .isLength({min:5})
        .withMessage(' Account ít nhất 5 ký tự')
        .isLength({max:20})
        .withMessage(' Account tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Account không chứa ký tự đặc biệt'),
    check('password')
        .isLength({min:5})
        .withMessage(' Password ít nhất 5 ký tự')
        .isLength({max:20})
        .withMessage(' Password tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Password không chứa ký tự đặc biệt'),
], function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var admin = req.body.admin;
    var password = req.body.password;
    var password2 = req.body.password2;

    
    if(admin == "Admin"){
        admin = 1;
    }
    else {
        admin = 0;
    }

    Account.findOne({}, function (err, account) {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()
            res.render('admin/add_account', {
                alert,
                user: user,
            })
        }
        if(!(password == password2)){
            req.flash('error','Password not match.');
                res.render('admin/add_account',{
                    title: 'Add Account',
                });
        }
        else{
            Account.findOne({username: username},function(err,account){
                if(account) {
                    req.flash('error','Account exists,choose another.');
                    res.render('admin/add_account',{
                        title: 'Add Account',
                    });
                }else {
                    var account = new Account({
                        name: name,
                        email: email,
                        username: username,
                        password: password,
                        admin: admin,
                    });

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(account.password, salt, function (err, hash) {
                            if (err){
                                console.log(err);
                            }
                            account.password = hash;

                            account.save(function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    req.flash('success', 'You are now Admin!');
                                    res.redirect('/admin/accounts')
                                }
                            });
                        });
                    });
                }
            });
        }
    });

    
    
});

// Get edit account
router.get('/edit-account/:id',isAdmin , function (req, res) {

    Account.findOne({_id:req.params.id}, function (err, account) {
        if (err){
            return console.log(err);
        }
        res.render('admin/edit_account', {
            name: account.name,
            email: account.email,
            username: account.username,
            password: account.password,
            id: account._id
        });
    });

});
// post edit account
router.post('/edit-account/:id',[
    check('name')
        .isLength({min:5})
        .withMessage(' User ít nhất 5 ký tự')
        .isLength({max:20})
        .withMessage(' User tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' User không chứa ký tự đặc biệt'),
    check('email')
        .isEmail()
        .withMessage(' Chỉ nhận Email'),
    check('username')
        .isLength({min:5})
        .withMessage(' Account ít nhất 5 ký tự')
        .isLength({max:20})
        .withMessage(' Account tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Account không chứa ký tự đặc biệt'),
    check('password')
        .isLength({min:5})
        .withMessage(' Password ít nhất 5 ký tự')
        .isLength({max:20})
        .withMessage(' Password tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Password không chứa ký tự đặc biệt'),
], function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body.id;
    
    Account.findOne({},function(err,user){
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()
            res.render('admin/edit_account', {
                alert,
                user: user,
                id: id,
                name: name,
                email: email,
                username: username,
                password: password,
            })
        }

        else{
            Account.findOne({username: username},function(err,account){
                if(account) {
                    account.name = name;
                    account.email = email;
                    account.email = email;
                    account.username = username;
                    account.password = password;

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(account.password, salt, function (err, hash) {
                            if (err){
                                console.log(err);
                            }
                            account.password = hash;

                            account.save(function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    req.flash('success', 'Account Edit Success!');
                                    res.redirect('/admin/accounts')
                                }
                            });
                        });
                    });
                }
            });
        }
    });
    
});
// Get delete account
router.get('/delete-account/:id',function (req, res) {
    Account.findByIdAndRemove(req.params.id, function (err) {
        if (err){
            return console.log(err);
        }
        Account.find(function (err, accounts) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.accounts = accounts;
            }
        });
        req.flash('success', 'Account deleted!');
        res.redirect('/admin/accounts/');
    });
});


// Exports
module.exports = router;