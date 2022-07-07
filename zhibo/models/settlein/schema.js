const mongoose = require("mongoose");

const SettleinSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },//用户ID
  platform_id: { type: mongoose.Schema.Types.ObjectId, ref: 'platform' }, //平台表
  platform_key: { type: String },  //平台ID
  platform_name: { type: String }, //平台昵称
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'company' }, //公司表
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'game' }, //游戏表
  game_key: { type: String },  //游戏ID
  game_name: { type: String }, //游戏昵称
  description: { type: String },   //入驻时间
  clearing_start_time: { type: Date, }, //清算起始时间，每次结算后将会修改该字段到今天。结算会结算这一天到今天的所有数据
  create_at: { type: Date, default: Date.now }, // 入驻时间
  work_at: { type: Date, default: new Date(0) },  //每次每次添加work表数据时候更新该时间 用来判断今天是否添加了工作结算
  // 以下是各种状态
  status: { type: Number, default: 1 }, //是否在播 0, 在播 ，1 停播 2  ，当任何关联公司，用户，平台，游戏，删除后变为2
  new_clearing_date: { type: Date },  // 最新的结款日期  结款后将修改该日期
  contract_status: { type: Number, default: 0 }, //合约状态，0试用期 1正式工
  user_status: { type: Number, default: 1 },  // 用户状态 0 停职 ，1 在岗 2 用户删除后
  company_status: { type: Number, default: 1 },  // 用户状态 0 合作中 1 合作终止 2 公司删除后
  game_status: { type: Number, default: 1 },  // 游戏状态 0 上架 1 下架 2 游戏删除后
  platform_status: { type: Number, default: 1 },  // 用户状态 0 入驻 1 撤离 2 平台删除后
  show: { type: Boolean, default: true },  //  默认显示 ,删除后只修改该条数据,但不直接删除数据,用作数据统计
  // --------------
  next_clearing_time: { type: Date, default: Date.now },  //下一次的清算事件。。。根据game中的settle_status字段来得出下一次结算日
});

SettleinSchema.virtual('contract_status_name').get(() => {
  return this.contract_status == 0 ? '试用期' : '正式工作'
})


module.exports = SettleinSchema