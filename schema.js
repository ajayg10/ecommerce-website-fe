import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    role : {
        type : String,
        enum: ["buyer", "seller"],
        default : "buyer"
    }
})

const productschema = new mongoose.Schema({
    name : String ,
    price : Number,
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    category : String
}) 

const cartschema = new mongoose.Schema({
    items: [{
        ProductId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"},
            quantity : {type: Number , default : 1}
        }]
})

export const Cart = mongoose.model('Cart', cartschema);
export const Product = mongoose.model('Product', productschema);
export const User = mongoose.model('User', userschema); 