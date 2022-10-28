const express = require('express');
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require('passport')
const ExpressError = require("../utilities/ExpressError");




router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        console.log(registeredUser)
        req.flash('success', 'Welcome to Yelp Camp!!!!')
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}));

router.get('/login', (req, res) => {
    res.render('users/login')
})

const test = (req, res, next) => {
    passport.authenticate('local', {failureFlash:true, failureRedirect: '/login' })
    next()
}
router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect: '/login',}), (req, res) => {
    req.flash("success", "welcome")
    res.redirect('/campgrounds');
});


module.exports = router;