const mongoose = require("mongoose");
const ClearingSchema = require('./model');

module.exports = mongoose.model("clearing", ClearingSchema, 'Clearing');