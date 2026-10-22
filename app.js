if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");


// requires the model with Passport-Local Mongoose plugged in
const user = require('./models/user.js');
const userRouter = require('./routes/user.js');


const Database_link = process.env.ATLASDB_URL;


main().then(()=>{
    console.log("The DB is connected");
}).catch((err)=>{
    console.log("The error in the connecting the DB");
})

async function main(){
    await mongoose.connect(Database_link);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl: Database_link,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("Error in mongo session",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave : false, 
    saveUninitialized : true,
    Cookie:{
        expires : Date.now() + 7*24*60*60*1000 ,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    },
}


app.use(session(sessionOptions));
app.use(flash());

//to initialize passport
passport.initialize();
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(user.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


const listingsRouter = require("./routes/listing.js");

const reviewsRouter = require("./routes/review.js");

app.get("/",(req,res)=>{
    res.send("The root is working");
});

app.use("/listings",listingsRouter);

app.use("/listings/:id/reviews",reviewsRouter);

app.use("/", userRouter);



// for handling the non-existing routes
app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"The page is not found"));
});

// for handling the error
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080,()=>{
    console.log("The server is running on the port 8080");
});