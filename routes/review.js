const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapSync = require("../utils/WrapSync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isReviewAuthor, isOwner } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        return next(
            new ExpressError(400, error.details[0].message)
        );
    }

    next();
};

// reviews page
router.post("/",isLoggedIn, validateReview, WrapSync(reviewController.reviewpage));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, WrapSync(reviewController.deleteReview));

module.exports = router;