const ExpressError = require("./utilities/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");



//checking if you are the author of the campground
module.exports.isAuthor = async(req, res, next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id))
    {
        req.flash('error', "You do not have permission")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

//checking if you are logged in as an authenticated User
module.exports.isLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash("error", "you must be signed in");
        return res.redirect('/login')
    }
    next();
}

//validating the server side for each add campground request
module.exports.validateCampground = (req, res, next) =>{
    
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

//validating review body via serverside
module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id))
    {
        req.flash('error', "You do not have permission")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}