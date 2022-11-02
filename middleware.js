module.exports.isLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()){
        const url = req.originalUrl
        req.session.returnTo = url
        console.log(req.session)
        
        req.flash("error", "you must be signed in");
        req.session.save(function(err) {
            if (err){
                return next(err);
            }
          })
        return res.redirect('/login')
    }

    next();
}