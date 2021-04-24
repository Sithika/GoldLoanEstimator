  
let mongoose = require("mongoose");
let pageViewSchema =require("./schema.js");
const pageViewModel = mongoose.model('pageviewmodels', pageViewSchema );
module.exports = pageViewModel ;
