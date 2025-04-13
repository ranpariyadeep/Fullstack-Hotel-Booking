const mongoose = require("mongoose");
const Schema  = mongoose.Schema;


// Define the schema for the listing
// The schema defines the structure of the data in the MongoDB collection
// The listing schema contains the following fields:

const listingSchema = new Schema({
    title: {
        type :String,
        required: true,
    },
    description: String,
    image:{
        type: String,
        default: "https://unsplash.com/photos/top-view-photo-of-houses-sPpe2D7VbpM",
     set:(v) => v === "" ? "https://unsplash.com/photos/top-view-photo-of-houses-sPpe2D7VbpM" : v,
    },
    price: Number,
    location: String,
    country: String,
});

// Create a model for the listing schema
// The model is used to interact with the MongoDB collection
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;