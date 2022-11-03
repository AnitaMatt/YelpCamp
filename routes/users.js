const express = require('express');
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require('passport')

//redirecting a user to the right place once they login
const returnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next()
}


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        console.log(registeredUser)
        req.login(registeredUser, err => {
            if (err) return next();
            req.flash('success', 'Welcome to Yelp Camp!!!!')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', returnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), function (req, res) {

    req.flash('success', "Welcome back ")
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye")
        res.redirect('/campgrounds');
    });

})

module.exports = router;