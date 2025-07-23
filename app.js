const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");



// Import routes
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// URL for connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// check if the MongoDB server is running
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Set the public directory for static files
app.use(express.static(path.join(__dirname, "public")));
// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
// Middleware to parse incoming JSON request bodies
app.use(express.json());
// Middleware to override HTTP methods
app.use(methodOverride("_method"));
// Middleware to use ejs-mate for layout
app.engine("ejs", ejsMate);

// root API
// app.get("/", (req, res) => {
//   res.send("I am a Root!");
// });





app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews)

//Test Listing API
// app.get("/testlisting", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Sample Listing",
//     description: "This is a sample listing",
//     image: "",
//     price: 100,
//     location: "New York",
//     country: "USA",
//   })
//   await sampleListing.save();
//   console.log("Sample listing saved");
//     res.send("success");
// });

//Error handling middleware
//pela badha upar na route ma check kare no male to baaki badh aroutni req. ma page not found

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somthing went wrong!" } = err;
  res.status(statusCode).render("error.ejs",{message});
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
