var GoogleStrategy = require('passport-google-oauth20').Strategy
var mongoose = require('mongoose')

var User = require('../models/user');

module.exports = function (passport) {

    passport.use(new GoogleStrategy({
        clientID: '568597639308-b36hqjuajag6dhitoieigishgd51de63.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/auth/google/callback',
    },
        async(accessToken, refreshToken, profile, done)=> {
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
            }
            try {
                let user = await User.findOne({ googleId: profile.id })
      
                if (user) {
                    done(null, user)
                } else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            }
            catch (err) {
                console.error(err)
            }
        }
          
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

}