const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

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

// root API
app.get("/", (req, res) => {
  res.send("I am a Root!");
});

//Test Listing API
app.get("/testlisting", async (req, res) => {
  let sampleListing = new Listing({
    title: "Sample Listing",
    description: "This is a sample listing",
    image: "",
    price: 100,
    location: "New York",
    country: "USA",
  })
  await sampleListing.save();
  console.log("Sample listing saved");
    res.send("success");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

