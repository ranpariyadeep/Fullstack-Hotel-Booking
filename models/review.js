const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the schema for the review
// we save the review in the database
// Comments, rating and time of creation
const reviewSchema = new Schema({
    comment:String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
        createdAt: {
        type: Date,
        default: Date.now(),
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User",
       
    }
    
});

module.exports = mongoose.model("Review", reviewSchema);

