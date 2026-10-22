const Listing = require("../models/listings");

module.exports.index = async (req,res)=>{
    let allListing = await Listing.find({});
    //  console.log(allListing);
    res.render("listings/index.ejs",{allListing});
}

module.exports.RenderForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","The Place was deleted!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.creatingRoutes = async (req,res,next)=>{
        
        let url = req.body.path;
        let filename = req.body.filename;

        if(!req.body.listing){
            throw new ExpressError(400,"Enter valid listing data");
        }

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }
        await newListing.save();
        
        req.flash("success","The new Place is added!");

        res.redirect("/listings");
    }

module.exports.editRoute = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","The Place was deleted or not existed!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs",{listing});
}

module.exports.updateRoute =async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if (typeof req.file !== "undefined") {
        listing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
            await listing.save();
        }
    req.flash("success","Place Updated!");
    res.redirect(`/listings/${id}`);
    // res.send("The info is updated");
}

module.exports.deleteRoute = async (req, res) => {

    let { id } = req.params;

    await Listing.findByIdAndDelete(id);

    req.flash("success","Place deleted!");

    res.redirect("/listings");

}