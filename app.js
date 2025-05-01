const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.get("/", (req, res) => {
  res.send("I am a Root!");
});

// API to render Listinga (Index Route)
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
});


//New Route (form to create a new listing)
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
  });

  //Create Route (create a new listing)
app.post("/listings", async (req, res) => {
  //  let { title, description, image, price, location, country } = req.body;
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
   
});

//Show Route ( full details of a specific listing)
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
});

//Edit Route (form to edit a listing)
app.get("/listings/:id/edit", async (req,res) =>{
    let { id } = req.params;
const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
});

//Update Route (update a listing)

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});
    res.redirect(`/listings/${id}`);
    });

    //Delete Route (delete a listing)
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}
);

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
