const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  name: { type: String }, // 游戏名称
  img_url: { type: String }, //图片地址
  szm: { type: String, default: '#' }, // 首字母
  description: { type: String }, //备注

  create_at: { type: Date, default: Date.now }, // 时间
  show: { type: Boolean, default: true },  //  默认显示 ,删除后只修改该条数据,但不直接删除数据,用作数据统计
  //状态
  status: { type: Number, default: 1 }, //状态 0 解除合作 1 合作 2删除
  reach_status: { type: Number, default: 0 },   //达标状态 0 按天 1按小时
  settle_status: { type: Number, default: 0 },   //结算状态 日周月季度年

  // 游戏要求
  reach_day: { type: Number, default: 0 },      //达标天数
  trial_price: { type: Number, default: 0 },    //厂商给的价格
  formal_price: { type: Number, default: 0 },    //厂商给的正式工价格
  custom_trial_price: { type: Number, default: 0 },   //自定义的试用期价格
  custom_formal_price: { type: Number, default: 0 },  //自定义的正式工价格
  play_time: { type: Number, default: 0 },      // 直播时间，这里直播时间的意思代表着主播需要播出到这个时间才算是达标。单位 小时
});


module.exports = GameSchema