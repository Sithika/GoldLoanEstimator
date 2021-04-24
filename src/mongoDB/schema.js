let mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = new Schema({
  id : String,
  loanDate : String,
  loanTime : String,
  goldWt : String,
  customerName : String,
  mobile : String,
  email : String,
  dataStoredAt : Date
});