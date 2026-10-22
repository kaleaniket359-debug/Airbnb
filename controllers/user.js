const User = require("../models/user");

module.exports.signup = async (req,res)=>{
    try{

        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }else{
                req.flash("success","Signed up successfully");
                res.redirect("/listings");
            }
        });
       
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup.ejs");
    }
}

module.exports.login =  (req,res)=>{
    res.render("users/login.ejs");
}