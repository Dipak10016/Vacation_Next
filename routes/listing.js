const express=require("express");
const router =express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");









//Validation for schema direct sarvana eksath 
const validateListing = (req, res, next) => {
    let {error} = listingSchema.listing.validate(req.body);
    
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join(" ,");
        throw new ExpressError(400,errMsg);
    } else {
        next(); // Call next only if validation passes
    }
};

//index route
router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});

}));

//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})


//show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));


// create route
router.post(
    "/",
    validateListing,
    wrapAsync(async(req,res,next)=>{
    /*try{*/

    

    const newListing=new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    

    /*}catch (err){
        next(err);
    }*/


}));



    


//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
router.put("/:id",
    validateListing,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");

}));

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


module.exports=router;