var express = require('express')
var passport = require('passport')
var router = express.Router()


//
router.get('/google',passport.authenticate('google', { scope: ['profile'] }));
// 
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/users/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);



// Exports
module.exports = router;