const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const validateListing = require("../middleware/validateListing");

// Index Route
 router.get("/", wrapAsync(async(req, res) => {
   const allListings =  await Listing.find({});
   res.render("./listings/index.ejs", {allListings});
}));

// New Route 
 router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
});

// Show Route 
 router.get("/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}));

// Create Route 
 router.post("/", validateListing, wrapAsync(async(req, res) => {
    const listing = req.body.listing;
    let newListing = new Listing(listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("./listings");
}));


// Edit Route 
 router.get("/:id/edit", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", {listing});
}));

// Update Route 
 router.put("/:id", validateListing, wrapAsync(async(req, res) => {
    let {id} = req.params;
    // const listing = req.body.listing;
    // console.log(listing);
    await Listing.findByIdAndUpdate(
        id, 
        {$set: req.body.listing},
        { new: true, runValidators: true }
    );
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`); 
}));

// delete Route
 router.delete("/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect('/listings')
}));


module.exports = router;