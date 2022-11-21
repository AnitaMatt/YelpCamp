const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}


module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new",)
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', "Sucessfully created a campground");
    res.redirect(`campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
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
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', "Cannot find that campground")
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    if (req.files) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
        camp.images.push(...imgs);
        await camp.save();
    }
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        const data = req.body.deleteImages
        // Remove the last character because a space was added at the end of each element
        data.forEach((last, i) => {
            data[i] = last.slice(0, -1);
        })
        await camp.updateOne({ $pull: { images: { filename: { $in: data } } } })
    }
    req.flash('success', "Sucessfully updated a campground");
    res.redirect(`/campgrounds/${camp._id}`)
}
let add = 5
add.toString
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deleted = await Campground.findByIdAndDelete(id);
    req.flash('success', "Sucessfully deleted a campground");
    res.redirect("/campgrounds");
}