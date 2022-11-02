const express = require('express');
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utilities/catchAsync")
const ExpressError = require("../utilities/ExpressError");
const {campgroundSchema} = require("../schemas")
const {isLoggedIn} = require('../middleware')

const validateCampground = (req, res, next) =>{
    
    const {error} = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

router.get('/',catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}));

router.get("/new", isLoggedIn,(req, res) => {
    res.render("campgrounds/new",)
});

router.post("/", isLoggedIn,validateCampground, catchAsync(async (req, res, next) => {
    // 
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success', "Sucessfully created a campground");
        res.redirect(`campgrounds/${campground._id}`);
}));

router.get("/:id",catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    // console.log(campground)
    if (!campground){
        req.flash('error', "Cannot find that campground")
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground })
}));

router.get("/:id/edit",isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground){
        req.flash('error', "Cannot find that campground")
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground })
}));

router.put('/:id', isLoggedIn,validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('edit', "Sucessfully edited a camground");
    req.flash('success', "Sucessfully updated a campground");
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete("/:id",isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    // console.log(deleted)
    req.flash('success', "Sucessfully deleted a campground");
    res.redirect("/campgrounds");
}));




module.exports = router