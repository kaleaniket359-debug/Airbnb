const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("The DB is connected");
}).catch((err)=>{
    console.log("The error in the connecting the DB");
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner : "6acd18291a7518fef7df1be0"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();