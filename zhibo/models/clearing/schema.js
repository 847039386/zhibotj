const mongoose = require("mongoose");
const dayjs = require('dayjs')

const ClearingSchema = new mongoose.Schema({
  work_id: { type: mongoose.Schema.Types.ObjectId, ref: 'work' },
  platform_id: { type: mongoose.Schema.Types.ObjectId, ref: 'platform' },
  settlein_id: { type: mongoose.Schema.Types.ObjectId, ref: 'settlein' },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'game' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  cost: { type: Number, default: 0 },    //成本价
  selling_price: { type: Number, default: 0 },    //售价
  profit: { type: Number, default: 0, },    //利润
  prize: { type: Number, default: 0, }, //奖金
  create_at: { type: Date, default: Date.now() }
});


module.exports = ClearingSchema