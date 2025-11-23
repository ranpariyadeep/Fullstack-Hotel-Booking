const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// Define the schema for the listing
// The schema defines the structure of the data in the MongoDB collection
// The listing schema contains the following fields:

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  locationType: {
  type: String,
  enum: [
    "mountain", "castles", "camping", "arctic",
    "beach", "farm", "city", "village",
    "lake", "desert", "forest", "island","iconicCity",
    "riverside", "countryside", "snow", "coastal"
  ],
  required: true
},
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// Middleware to delete reviews when a listing is deleted
// This middleware runs after a listing is deleted and removes all associated reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }
});

// Create a model for the listing schema
// The model is used to interact with the MongoDB collection
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
