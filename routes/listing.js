const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema ,reviewSchema } = require("../schema.js");

const Listing = require("../models/listing.js");
 const {isLoggedIn} = require("../middleware.js");



const validateListing = (req, res, next) => {
  let {error} =  listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
};




// API to render Listinga (Index Route)
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});

//New Route (form to create a new listing)
router.get("/new",isLoggedIn, async(req, res) => {
  // check if user is logged in
  // if(!req.isAuthenticated()){
  //   req.flash("error","You must be signed in first!");
  //   return res.redirect("/login");
  // }
  res.render("./listings/new.ejs");
});

//Create Route (create a new listing)
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    //  let { title, description, image, price, location, country } = req.body;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
  })
);

//Show Route ( full details of a specific listing)
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
  })
);

//Edit Route (form to edit a listing)
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
  })
);

//Update Route (update a listing)

router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    req.flash("success", "Successfully Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route (delete a listing)
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Listing Deleted!");
    res.redirect("/listings");
  })
);



module.exports = router;
