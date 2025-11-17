const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");



const { validateReview,isLoggedIn,isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//Reviews
//post Route (create a new review for a listing)
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete review Route (delete a review from a listing)
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
