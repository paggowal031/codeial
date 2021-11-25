const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: "374311102697-qgmfgfvnv210701aqjffnr8083ba5jlp.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) {
                console.log('Erorr in google auth strategy ', err);
                return;
            }

            console.log(profile);
            if (user) {
                return done(null, user);
            }
            else {
                //create user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex');
                }, function (err, user) {
                    if (err) {
                        console.log('Erorr in creating user in google strategy', err);
                        return;
                    }
                    else {
                        return done(null, user);
                    }
                })
            }
        })

    }
}))