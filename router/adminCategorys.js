var express = require('express');
var router = express.Router();
var { check, validationResult } = require('express-validator');
var admin = require('../config/admin');
var isAdmin = admin.isAdmin;
// Get Category module
var Category = require('../models/category');
var User = require('../models/user');
// Get categorys index
router.get('/',isAdmin , function (req, res) {
    Category.find(function (err, categorys) {
        res.render('admin/categorys', {
            categorys: categorys
        });
    });
});

// Get add categorys
router.get('/add-category',isAdmin ,function(req,res) {
    res.render('admin/add_category');
});

// Post add categorys
router.post('/add-category',[
    check('title')
        .isLength({min:5})
        .withMessage(' Title ít nhất 5 ký tự')
        .isLength({max:20})
        .withMessage(' Title tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Title không chứa ký tự đặc biệt'),
],function(req,res) {
    
    var title = req.body.title;
    const errors = validationResult(req)
    User.findOne({}, function (err, user) {
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()
            res.render('admin/add_category', {
                alert,
                user: user,
            })
        }
        else{
            var category = new Category({
                title: title,
            });
            category.save(function(err) {
                if(err){
                    return console.log(err);
                }
                Category.find(function (err, categorys) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.app.locals.categorys = categorys;
                    }
                });  
                
                req.flash('success','Category added!');
                res.redirect('/admin/categorys');
            });
        }
    });
});

// Get edit categorys
router.get('/edit-category/:slug',isAdmin , function (req, res) {
    Category.findOne({slug:req.params.slug}, function (err, category) {
        console.log(category.title);
        if (err){
            return console.log(err);
        }
        res.render('admin/edit_category', {
            title: category.title,
            slug: category.slug,
            id: category._id
        });
    });

});

// Post edit categorys

router.post('/edit-category/:slug',[
    check('title')
        .isLength({min:3})
        .withMessage(' Title ít nhất 3 ký tự')
        .isLength({max:20})
        .withMessage(' Title tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Title không chứa ký tự đặc biệt'),
],function(req,res) {
    
    var title = req.body.title;
    var id = req.body.id;

    
    

    Category.findOne({slug:req.params.slug}, function (err, category) {
        if (err){
            return console.log(err);
        }
        User.findOne({}, function (err, user) {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                // return res.status(422).jsonp(errors.array())
                const alert = errors.array()
                res.render('admin/edit_category', {
                    alert,
                    user: user,
                    slug: category.slug,
                    title: title,
                    id: id,
                })
            }
            else{
                Category.findById({_id: id},function(err,category) {
                    if(err){
                        return console.log(err);
                    }
                        
                    category.title = title;

                    category.save(function(err) {
                        if(err){
                            return console.log(err);
                        }
                        Category.find(function (err, categorys) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categorys = categorys;
                            }
                        });   
                        
                        req.flash('success','Category Edit Success!');
                        res.redirect('/admin/categorys');
                    });
                })
            }
        });
        
    });

    
    
    
});
// Get delete category
router.get('/delete-category/:id',function (req, res) {
    Category.findByIdAndRemove({_id:req.params.id}, function (err) {
        if (err){
            return console.log(err);
        }
        Category.find(function (err, categorys) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categorys = categorys;
            }
        });
        req.flash('success', 'Category deleted!');
        res.redirect('/admin/categorys/');
    });
});

// Exports
module.exports = router;