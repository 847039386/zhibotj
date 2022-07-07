const mongoose = require("mongoose");
const PlatformSchema = require('./model');

module.exports = mongoose.model("platform", PlatformSchema, 'Platform');