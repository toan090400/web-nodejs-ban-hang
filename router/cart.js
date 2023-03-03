var express = require('express');
var router = express.Router();

// Get Product model
var Product = require('../models/product');
var Cart = require('../models/cart');
var User = require('../models/user');


// Add to cart
router.get('/add/:product',function(req,res) {
    var title = req.params.product;
    Product.findOne({title: title}, function (err, product) {
        if (err){
            console.log(err);
        }
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: title,
                qty: 1,
                price: product.price,
                image: '/product_images/' + product._id + '/' + product.image
            });
        }
        else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == title) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: title,
                    qty: 1,
                    price: product.price,
                    image: '/product_images/' + product._id + '/' + product.image
                });
            }
        }

        //console.log(req.session.cart);
        req.flash('success', 'Product added!');
        res.redirect('back');
    });
});

/*
 * GET checkout page
 */
router.get('/checkout', function (req, res) {

    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        res.render('checkout', {
            title: 'Checkout',
            cart: req.session.cart
        });
    }
    

});

/*
 * GET update product
 */
router.get('/update/:product', function (req, res) {

    var title = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == title) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1){
                        cart.splice(i, 1);
                    } 
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0){
                        delete req.session.cart;
                    }  
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');

});

/*
 * GET clear cart
 */
router.get('/clear', function (req, res) {

    delete req.session.cart;
    
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');

});

router.post('/pay', function (req, res) {

    
    
    var products = req.session.cart;
    var name = req.body.name;
    var total = req.body.total;
    var username = req.body.username;
    // var phone = req.body.phone;
    // var address = req.body.address;

    
    User.findOne({_id:req.params.id}, function (err, user) {
        if (err){
            return console.log(err);
        }
        else{
            var cart = new Cart({
                products: products,
                name: name,
                username: username,
                total: total,
                // phone: phone,
                // address: address,
            });

            cart.save(function(err) {
                if(err){
                    return console.log(err);
                }
                Cart.find(function (err, carts) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.app.locals.carts = carts;
                    }
                });  
                delete req.session.cart;
                req.flash('success', 'Cart Pay!');
                res.redirect('/cart/checkout');
            });
        }
        
    });


});

// Exports
module.exports = router;