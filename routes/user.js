const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
 const {saveRedirect} = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUer = await User.register(newUser, password);

      // new singup user ne login karavi deva mate
      req.login(registerUer, (err) => {
        if (err){ return next(err)};
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
      
     
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirect,
  //login thay e pela passport.authenticate mate check karse
  // local- kai strategy use karvi che
  passport.authenticate("local", {
    //jo lo
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success","Welcome back to Wanderlust!");
    // /listing aetle k jo koi direct /login par aave to /listing par redirect karse
    res.redirect(res.locals.redirectUrl || "/listings");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
});
module.exports = router;
