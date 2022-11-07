const express = require('express');
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utilities/catchAsync")
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const { populate } = require('../models/review');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new",)
});

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // 
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "Sucessfully created a campground");
    res.redirect(`campgrounds/${campground._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author')
    if (!campground) {
        req.flash('error', "Cannot find that campground")
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground })
}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', "Cannot find that campground")
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground })
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('edit', "Sucessfully edited a camground");
    req.flash('success', "Sucessfully updated a campground");
    res.redirect(`/campgrounds/${camp._id}`)
}));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    // console.log(deleted)
    req.flash('success', "Sucessfully deleted a campground");
    res.redirect("/campgrounds");
}));




module.exports = router