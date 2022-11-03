const ExpressError = require("./utilities/ExpressError");
const { campgroundSchema } = require("./schemas")
const Campground = require("./models/campground");

module.exports.isLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash("error", "you must be signed in");
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req, res, next) =>{
    
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}
module.exports.isAuthor = async(req, res, next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id))
    {
        req.flash('error', "You do not have permission")
        res.redirect(`/campgrounds/${id}`)
    }
    next()
}