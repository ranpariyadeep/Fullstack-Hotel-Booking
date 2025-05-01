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
        default: "https://images.unsplash.com/photo-1513880989635-6eb491ce7f5b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=maximillian-conacher-sPpe2D7VbpM-unsplash.jpg&w=1920",
     set:(v) => v === "" ? "https://images.unsplash.com/photo-1513880989635-6eb491ce7f5b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=maximillian-conacher-sPpe2D7VbpM-unsplash.jpg&w=1920" : v,
    },
    price: Number,
    location: String,
    country: String,
});

// Create a model for the listing schema
// The model is used to interact with the MongoDB collection
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;