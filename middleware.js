module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
  if (!req.isAuthenticated()) {
    //redirect thase login page par
    //originalUrl - je url par user hato and have login karva mate aavyo che
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirect  = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};