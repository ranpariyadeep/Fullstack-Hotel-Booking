const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview,isLoggedIn,isReviewAuthor } = require("../middleware.js");



//Reviews
//post Route (create a new review for a listing)
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    //listing (listing.js) in andar reviews name no array banavel che , tema save kari day
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New review added");
    req.flash("success", "Successfully Review Created!");
    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete review Route (delete a review from a listing)
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // delete the review Object id from the reviews array in the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // delete the review from the Review collection
    await Review.findByIdAndDelete(reviewId);
     req.flash("success", "Successfully Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
