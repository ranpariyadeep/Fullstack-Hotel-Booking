if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");

const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const app = express();
const ExpressError = require("./utils/ExpressError.js");



// Import routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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


const sessionOptions = {
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,

    // secure:true, //only works on https
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
  },
};

app.get("/", (req, res) => {
  res.send("This is the root page");
});



app.use(session(sessionOptions));
app.use(flash());

// User Authentication
app.use(passport.initialize());
app.use(passport.session());
// Use the local strategy for authentication
passport.use(new LocalStrategy(User.authenticate()));

//serialize - how to store a user in the session
//deserialize - how to get the user out of the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  //console.log(success);
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next(); 
});




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/", userRouter);


//Error handling middleware
//pela badha upar na route ma check kare no male to baaki badh aroutni req. ma page not found



// ...your app routes and other middleware...


// Catch-all 404 handler
app.use((req, res, next) => {
  next({ statusCode: 404, message: "Page Not Found!" });
});



// Centralized error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
