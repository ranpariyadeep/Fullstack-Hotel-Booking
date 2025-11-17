const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingControllers = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingControllers.index))

  //Create Route (create a new listing)
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingControllers.createListing)
  );

//New Route (form to create a new listing)
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router
  .route("/:id")

  //Show Route ( full details of a specific listing)
  .get( wrapAsync(listingControllers.showListing))

  //Update Route (update a listing)

  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingControllers.updateListing)
  )
  //Delete Route (delete a listing)

  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.deleteListing)
  );

//Edit Route (form to edit a listing)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)
);

module.exports = router;
