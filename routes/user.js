const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const WrapSync = require("../utils/WrapSync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
const userController = require("../controllers/user.js");

//signup
router.post("/signup",userController.signup);

//login
router.get("/login",WrapSync(userController.login));

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}), async(req,res)=>{
    req.flash("success","Welcome to our app");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err) => {
        if(err){
            next(err);
        }
        req.flash("success","You logged-out successfully");
        res.redirect("/listings");
    });
});

module.exports = router;