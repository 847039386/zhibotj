const mongoose = require("mongoose");

const WorkSchema = new mongoose.Schema({
  // 各种ID
  platform_id: { type: mongoose.Schema.Types.ObjectId, ref: 'platform' },
  settlein_id: { type: mongoose.Schema.Types.ObjectId, ref: 'settlein' },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'company' },
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'game' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  // 状态与起始时间
  status: { type: Number, default: 0 },   //0为未清算 1是清算后
  start_of_time: { type: Date, },   //账单开始时间
  end_of_time: { type: Date, },   //账单结束时间
  // 每日任务
  tasks: [
    {
      dau: { type: Number, default: 0 }, // 今日场观
      like: { type: Number, default: 0 }, //今日点赞
      follow: { type: Number, default: 0 },//今日关注 
      work_time: { type: Number, default: 0 }, // 今日工作时间
      contract_status: { type: Number, default: 0 },  //合约状态 从入驻表里获得
      description: { type: String, default: '' }, //备注
      create_at: { type: Date, default: Date.now }, // 当前数据添加的时间
    }
  ],
  // 结算后所有游戏数据价格将保存到历史数据里
  history: {
    name: { type: String },
    reach_status: { type: Number },
    trial_price: { type: Number },
    formal_price: { type: Number },
    custom_trial_price: { type: Number },
    custom_formal_price: { type: Number },
    reach_day: { type: Number },
    play_time: { type: Number },
    settle_status: { type: Number }
  },
  // 系统时间
  create_at: { type: Date, default: Date.now },   //这个账单的创建时间并非入驻时间
});

WorkSchema.virtual('status_name').get(() => {
  return this.contract_status == 0 ? '未结算' : '已结算'
})

WorkSchema.set('toObject', { virtual: true })


module.exports = WorkSchema