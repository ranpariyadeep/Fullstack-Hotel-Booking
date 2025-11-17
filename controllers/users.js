const User = require("../models/user.js");


module.exports.renderSignup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.userSignup = async (req, res) => {
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
  };

  module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.userLogin =async (req, res) => {
    req.flash("success","Welcome back to Wanderlust!");
    // /listing aetle k jo koi direct /login par aave to /listing par redirect karse
    res.redirect(res.locals.redirectUrl || "/listings");
  };

module.exports.userLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};