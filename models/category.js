var mongoose = require('mongoose');
var URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

// Category Schema
var CategorySchema = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    slug:{
        type: String,
        slug: "title",
        unique: true
    },
    
},{
    timestamps: true,
});

var Category = module.exports = mongoose.model('Category',CategorySchema);
