const mongoose = require("mongoose");
const { title } = require("node:process");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");
const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },

    image: {
    url: String,    
    filename:String
    },
    price : {type : Number,
        required : true,
    },
    description : String,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;