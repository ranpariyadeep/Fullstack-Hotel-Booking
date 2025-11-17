const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");

const userControllers = require("../controllers/users.js");

router
  .route("/signup")
  .get(userControllers.renderSignup)
  .post(wrapAsync(userControllers.userSignup));

router
  .route("/login")
  .get(userControllers.renderLogin)

  .post(
    saveRedirect,
    //login thay e pela passport.authenticate mate check karse
    // local- kai strategy use karvi che
    passport.authenticate("local", {
      //jo lo
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userControllers.userLogin
  );

router.get("/logout", userControllers.userLogout);

module.exports = router;
