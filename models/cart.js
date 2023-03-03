var mongoose = require('mongoose');

var URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);

// Page Schema
var CartSchema = mongoose.Schema({
    products: [
        {
            title: { type: String },
            qty: { type: Number },
            price: { type: Number },
            image: { type: String },
        },
    ],
    total:{
        type: Number
    },
    username:{
        type: String
    },
    name:{
        type: String
    },
    phone:{
        type: String
    },
    address:{
        type: String
    },
    slug:{
        type: String,
        slug: "name",
        unique: true
    },
    status: { type: Boolean, default: false },
    
},{
    timestamps: true,
});

var Cart = module.exports = mongoose.model('Cart',CartSchema);