var express = require('express');
var router = express.Router();
var { check, validationResult } = require('express-validator');

var passport = require('passport');
var bcrypt = require('bcryptjs');

// Get Users model
var User = require('../models/user');

//GET register
router.get('/register', function (req, res) {

    res.render('register', {
        title: 'Register'
    });

});

//POST register
router.post('/register',[
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
    var password2 = req.body.password2;

    
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('register', {
            alert,
            user: null,
            title: 'Register'
        })
    }
    if(!(password == password2)){
        req.flash('error','Password not match.');
        res.render('register',{
            title: 'Register',
        });
    }

    else {
        User.findOne({username: username}, function (err, user) {
            if (err){
                console.log(err);
            }
            if (user) {
                req.flash('danger', 'Username exists, choose another!');
                res.redirect('/users/register');
            } else {
                var user = new User({
                    name: name,
                    email: email,
                    username: username,
                    password: password,
                    admin: 0
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err){
                            console.log(err);
                        }
                        user.password = hash;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'You are now registered!');
                                res.redirect('/users/register')
                            }
                        });
                    });
                });
            }
        });
    }

});

//GET login
router.get('/login', function (req, res) {

    if (res.locals.user) res.redirect('/');
    
    res.render('login', {
        title: 'Login'
    });

});

//POST login
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })
    (req, res, next);

});

//GET logout
router.get('/logout', function (req, res) {

    req.logout();
    
    req.flash('success', 'You are logged out!');
    res.redirect('/users/login');

});

// GET edit account by custommer
router.get('/:id' , function (req, res) {
    User.findOne({_id:req.params.id}, function (err, account) {
        if (err){
            return console.log(err);
        }

        res.render('information', {
            title:"Information",
            name: account.name,
            email: account.email,
            username: account.username,
            password: account.password,
            id: account._id
        });
    });

});

// POST edit account
router.post('/information/:id', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var id = req.body.id;
    

    User.findOne({_id:req.params.id}, function (err, user) {
        if (err){
            return console.log(err);
        }
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()
            res.render('information', {
                alert,
                id: id,
                name: name,
                email: email,
                username: username,
                password: password,
                title: 'Information',
                user: user,
            })
        }
        else{
            User.findOne({username: username},function(err,user){
                if(user) {
                    user.name = name;
                    user.email = email;
                    user.email = email;
                    user.username = username;
                    user.password = password;

                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(user.password, salt, function (err, hash) {
                            if (err){
                                console.log(err);
                            }
                            user.password = hash;
    
                            user.save(function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    req.flash('success', 'Account Edit Success!');
                                    res.redirect('/users/'+id);
                                }
                            });
                        });
                    });
                    
                }
            });
        }
    });

});

var Cart = require('../models/cart');
// Get bill by custommer
router.get('/bills/:username' , function (req, res) {

    var usernameBill = req.params.username;

    User.findOne({username: usernameBill}, function (err, account) {

        Cart.find({username: usernameBill},function (err, carts) {
            res.render('bill', {
                title:"Bills",
                carts: carts,
                account: account,
            });
        });
    });

});
// Get bill detail by custommer
router.get('/details-cart/:slug', function (req, res) {

    Cart.findOne({slug:req.params.slug}, function (err, cart) {
        if (err){
            return console.log(err);
        }
        res.render('bill_detail', {
            title:"Bill Detail",
            id: cart._id,
            slug: cart.slug,
            status: cart.status,
            products: cart.products
        });
    });

});

// Exports
module.exports = router;