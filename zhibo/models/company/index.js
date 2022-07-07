const mongoose = require("mongoose");
const CompanySchema = require('./model');

module.exports = mongoose.model("company", CompanySchema, 'Company');