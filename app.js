const express=require("express");
const mongoose=require("mongoose");
//require module la
const Listing = require( "./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const app=express();
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {reviewSchema}=require("./schema.js");
const Review = require( "./models/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session =require("express-session");
const flash=require("connect-flash");

//bassic ejs sathi setup
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
//data proper parse honyasathi 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));





//database connection sathi
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);

});
async function main(){
await mongoose.connect(MONGO_URL);
}




const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,

        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};


//basic api 
app.get("/",(req,res)=>{
    res.send("hii i am a root");
});


app.use((session(sessionOptions)));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    next();

});












app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);















// listing test cha api 
/*app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"my villa",
        description:"BY road",
        price:1200,
        location:"india",
        country: "india",
    });

    await  sampleListing.save();
    console.log("save");
    res.send("successful");
});*/



app.all("*" ,(req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND "));
});



app.use((err,req,res,next)=>{
    let {statusCode=500,message="SOMETHING WENT WRONG "}=err;
    res.render("error.ejs",{message});
    //res.status(statusCode).send(message);

});





//server start
app.listen(8080, () => {
    console.log("server is start on port 8080");
});