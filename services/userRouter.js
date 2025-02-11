const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../middlewares/authenticat.js");
const userControllers = require("../controllers/user.js");

router.get("/logout",userControllers.logout);

router.route("/register")
    .get(userControllers.renderRegisterForm)
    .post(userControllers.register);

router.route("/login")
    .get(userControllers.renderloginForm)
    .post(middleware.redirecturl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userControllers.login);



router.route("/editProfile") 
      .get(middleware.isLoggedIn,userControllers.randerEditProfileForm)
      .post(middleware.isLoggedIn,userControllers.editProfile);   
module.exports = router;