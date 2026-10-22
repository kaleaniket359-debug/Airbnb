const express = require("express");
const router = express.Router();
const WrapSync = require("../utils/WrapSync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listings.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
console.log("Multer configured");
//error by handling middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        return next(
            new ExpressError(400, error.details[0].message)
        );
    }

    next();
};


//new route
router.get("/new",isLoggedIn,WrapSync((req,res)=>{
    res.render("listings/new.ejs");
}));

//index route
router.get("/", WrapSync(listingController.index));

//show route
router.get("/:id",WrapSync( listingController.RenderForm));


// Create route
// router.post(
//     "/",
//     isLoggedIn,
//     upload.single("listing[image]"),
//     validateListing,
//     WrapSync(listingController.creatingRoutes)
// );

router.post(
    "/",
    isLoggedIn,
    (req, res, next) => {
        upload.single("listing[image]")(req, res, (err) => {
            if (err) {
                console.log("Multer error code:", err.code);
                console.log("Rejected field:", err.field);
                return res.status(400).send(err.message);
            }

            console.log("Uploaded file:", req.file);
            next();
        });
    },
    validateListing,
    WrapSync(listingController.creatingRoutes)
);
// router.post("/",upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file);
// })
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,WrapSync( listingController.editRoute));

//update route
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
     WrapSync(listingController.updateRoute));

//delete route
router.delete("/:id",isLoggedIn, isOwner, WrapSync(listingController.deleteRoute));

module.exports = router;