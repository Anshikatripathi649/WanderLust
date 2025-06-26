const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/rating.js");
const validateReview = require("../middleware/validateReview.js");


// Review 
// Post Review Route
 router.post("/",validateReview, wrapAsync(async(req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

     if (!listing) {
        return res.status(404).send("Listing not found");
    }

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    console.log("new review saved!");
    res.redirect(`/listings/${listing._id}`)
    // res.send("review is listed!")

}));

// Delete Review Route
 router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);

}));


module.exports = router;