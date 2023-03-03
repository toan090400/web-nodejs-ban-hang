var express = require('express');
var router = express.Router();
var { check, validationResult } = require('express-validator');

var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');

var admin = require('../config/admin');
var isAdmin = admin.isAdmin;
// Get Product module
var Product = require('../models/product');
// Get Category model
var Category = require('../models/category');
var User = require('../models/user');

// Get Product index
router.get('/',isAdmin, function (req, res) {
    Product.find(function (err, products) {
        res.render('admin/products', {
            products: products,
        });
    });
});

// Get add products
router.get('/add-product',isAdmin,function(req,res) {
    Category.find(function (err, categorys) {
        res.render('admin/add_product', {
            categorys: categorys,
        });
    });
});

// Post add products
router.post('/add-product',[
    check('title')
        .isLength({min:5})
        .withMessage(' Title ít nhất 5 ký tự')
        .isLength({max:20})
        .withMessage(' Title tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Title không chứa ký tự đặc biệt'),
    check('description')
        .isLength({min:5})
        .withMessage(' Description ít nhất 5 ký tự')
        .isLength({max:50})
        .withMessage(' Description tối đa 50 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Description không chứa ký tự đặc biệt'),
    check('price')
        .isNumeric()
        .withMessage(' Price chỉ có thể nhập số'),
    check('category')
        .isLength({min:1})
        .withMessage(' Category không để trống')
        
], function (req, res) {

    let imageFile = ""
    if (req.files && typeof req.files.image !== "undefined"){
        imageFile = req.files.image.name;    
    };
    var title = req.body.title;
    var description = req.body.description;
    var price = req.body.price;
    var category = req.body.category;

    User.findOne({}, function (err, user) {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()
            res.render('admin/add_product', {
                alert,
                user: user,
            })
        }
        else {
            var product = new Product({
                title: title,
                description: description,
                price: price,
                category: category,
                image: imageFile,
            });

            product.save(function (err) {
                if (err){
                    return console.log(err);
                }
                    
                mkdirp('public/product_images/' + product._id, function (err) {
                    return console.log(err);
                });

                mkdirp('public/product_images/' + product._id + '/gallery', function (err) {
                    return console.log(err);
                });

                mkdirp('public/product_images/' + product._id + '/gallery/thumbs', function (err) {
                    return console.log(err);
                });

                if (imageFile != "") {
                    var productImage = req.files.image;
                    var path = 'public/product_images/' + product._id + '/' + imageFile;

                    productImage.mv(path, function (err) {
                        return console.log(err);
                    });
                }

                req.flash('success', 'Product added!');
                res.redirect('/admin/products');
            });
        }
    });
    
    

});

// // Get edit products
router.get('/edit-product/:id',isAdmin,function (req, res) {
    var errors;
    if (req.session.errors){
        errors = req.session.errors;
    }

    req.session.errors = null;

    Category.find({},function (err, categorys) {
        Product.findById({_id:req.params.id}, function (err, product) {
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            } else {
                var galleryDir = 'public/product_images/' + product._id + '/gallery';
                var galleryImages = null;

                fs.readdir(galleryDir, function (err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;

                        res.render('admin/edit_product', {
                            categorys: categorys,
                            errors: errors,

                            title: product.title,
                            description: product.description,
                            category: product.category,
                            price: product.price,
                            vip: product.vip,
                            image: product.image,
                            id: product._id,

                            galleryImages: galleryImages,
                        });
                    }
                });
            }
        });
    });

});

// Post edit products

router.post('/edit-product/:id',[
    check('title')
        .isLength({min:3})
        .withMessage(' Title ít nhất 3 ký tự')
        .isLength({max:20})
        .withMessage(' Title tối đa 20 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Title không chứa ký tự đặc biệt'),
    check('description')
        .isLength({min:5})
        .withMessage(' Description ít nhất 5 ký tự')
        .isLength({max:200})
        .withMessage(' Description tối đa 200 ký tự')
        .matches(/^[a-zA-Z0-9]/)
        .withMessage(' Description không chứa ký tự đặc biệt'),
    check('price')
        .isNumeric()
        .withMessage(' Price chỉ có thể nhập số'),
],function(req,res) {

    let imageFile = ""
    if (req.files && typeof req.files.image !== "undefined"){
        imageFile = req.files.image.name;    
    };

    var title = req.body.title;
    var description = req.body.description;
    var price = req.body.price;
    var category = req.body.category;
    var vip = req.body.vip;
    var image = req.body.image;
    var id = req.params.id;

    var category_old = req.body.category_old;
    var vip_old = req.body.vip_old;

    if(category){
        category = category;
    }
    else{
        category = category_old;
    }
    if(vip){
        vip = vip;
    }
    else{
        vip = vip_old;
    }

    
    User.findOne({}, function (err, user) {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()
            res.render('admin/edit_product', {
                alert,
                user: user,
                description: description,
                price: price,
                category: category,
                category_old: category_old,
                title: title,
                vip:vip,
                id: id,
            })
        }
        else {
            Product.findById({_id:id}, function (err, product) {
                if (err){
                    console.log(err);
                }
                product.title = title;
                product.description = description;
                product.price = price;
                product.category = category;
                product.vip = vip;

                if (imageFile != "") {
                    product.image = imageFile;
                }

                product.save(function (err) {
                    if (err)
                        console.log(err);

                    if (imageFile != "") {
                        if (image != "") {
                            fs.remove('public/product_images/' + id + '/' + image, function (err) {
                                if (err){
                                    console.log(err);
                                }
                            });
                        }

                        var productImage = req.files.image;
                        var path = 'public/product_images/' + id + '/' + imageFile;

                        productImage.mv(path, function (err) {
                            return console.log(err);
                        });

                    }

                    req.flash('success', 'Product edited!');
                    res.redirect('/admin/products');
                });

            });
        }
    });

    
    
});
// Get delete products
router.get('/delete-product/:id',function (req, res) {
    
    Product.findByIdAndRemove({_id:req.params.id}, function (err) {
        if (err){
            return console.log(err);
        }
        req.flash('success', 'Product deleted!');
        res.redirect('/admin/products/');
    });
});

// Exports
module.exports = router;