const mongoose = require("mongoose");
// schema variable made taklay
const Schema = mongoose.Schema;
const Review=require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: Number,
    location: String,
    country: String,
    image: {
        type: String,
        default: "image-photo/hermitage-our-lady-peace-vila-franca-2284414131",
        set: (v) => (v === "" ? "image-photo/hermitage-our-lady-peace-vila-franca-2284414131" : v),
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },

    ],
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }

});



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
