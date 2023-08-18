import mongoose from "mongoose";

const cartData = mongoose.Schema({
    email: {
        type:String,
        required: true
    },
    items:{
        type:[{
            name: String,
            quantity: Number,
            price: Number,
        }],
        required: true
    },

},{timestamps: true})

export default mongoose.model("cartData", cartData);