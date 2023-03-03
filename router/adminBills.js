var express = require('express');
var router = express.Router();
var admin = require('../config/admin');
var isAdmin = admin.isAdmin;
// Get Category module
var Cart = require('../models/cart');

// Get categorys index
router.get('/',isAdmin , function (req, res) {
    Cart.find(function (err, carts) {
        res.render('admin/bills', {
            carts: carts
        });
    });
});


// Get edit details-cart/slug
router.get('/details-cart/:slug',isAdmin , function (req, res) {

    Cart.findOne({slug:req.params.slug}, function (err, cart) {
        if (err){
            return console.log(err);
        }
        res.render('admin/details-cart', {
            id: cart._id,
            slug: cart.slug,
            status: cart.status,
            products: cart.products
        });
    });

});

// Post detail-cart/slug

router.post('/edit-bill/:slug',function(req,res) {
    
    
    var slug = req.body.slug
    
    var status = req.body.status

    var id = req.body.id;


    Cart.findOne({slug: slug,_id:{'id=':id}},function(err,cart){
        if(cart) {
            req.flash('danger','Cart slug exists,choose another.');
            res.render('admin/edit_category',{
                title: title,
                slug: slug,
                id: id,
            });
        }else {
            Cart.findById(id,function(err,cart) {
                if(err){
                    return console.log(err);
                }
                    
                cart.status = status;  

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
                    
                    req.flash('success','Cart Checkout Success!');
                    res.redirect('back');
                });
            })

            
        }
    });
    
});

// Exports
module.exports = router;