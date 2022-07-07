const mongoose = require("mongoose");
const WorkSchema = require('./model');

module.exports = mongoose.model("work", WorkSchema, 'Work');