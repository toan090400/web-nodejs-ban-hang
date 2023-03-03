var express = require('express');
var router = express.Router();
// Get Product module
var Product = require('../models/product');
// Get Category model
var Category = require('../models/category');

var admin = require('../config/admin');
var isUser = admin.isUser;

/*
 * GET products by category
 */
router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function (err, category) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err){
                console.log(err);
            }
            res.render('category_product', {
                title: category.title,
                products: products
            });
        });
    });

});

/*
 * GET products detail by category
 */
router.get('/:category/:product',isUser, function (req, res) {

    

    Product.findOne({slug: req.params.product}, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            if (err) {
                console.log(err);
            } else {
                res.render('product', {
                    title: product.title,
                    product: product,
                        
                });
            }
            
        }
    });

});


// Exports
module.exports = router;