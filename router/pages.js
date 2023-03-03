var express = require('express');
var router = express.Router();

var Product = require('../models/product');

// Get Home page
router.get('/',function(req,res) {
    Product.find(function (err, products) {
        if (err){
            console.log(err);
        }
        res.render('all_product', {
            title: 'Home',
            products: products,
        });
    });
});






// Exports
module.exports = router;