const mongoose = require("mongoose");
const GameSchema = require('./model');

module.exports = mongoose.model("game", GameSchema, 'Game');