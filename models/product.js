var mongoose = require('mongoose');
var URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

// Product Schema
var ProductSchema = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    slug:{
        type: String,
        slug: "title",
        unique: true
    },
    description:{
        type: String,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    image:{
        type: String,
    },
    
},{
    timestamps: true,
});

var Product = module.exports = mongoose.model('Product',ProductSchema);
