const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}


module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next();
            accUser = req.user.username
            req.flash('success', `Welcome to Yelp Camp ${accUser}`)
            res.redirect('/campgrounds')
        })

    } catch (e) {
        if (e.keyPattern && e.keyPattern.email) {
            e.message = "Email already exists"
        }
        req.flash('error', e.message)
        res.redirect('/register')
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}


module.exports.login = function (req, res) {
    accUser = req.user.username
    req.flash('success', `Welcome back ${accUser}`)
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    accUser = req.user.username
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', `Goodbye ${accUser}`)
        res.redirect('/campgrounds');
    });

}