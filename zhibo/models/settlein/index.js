const mongoose = require("mongoose");
const SettleinSchema = require('./model');

module.exports = mongoose.model("settlein", SettleinSchema, 'Settlein');