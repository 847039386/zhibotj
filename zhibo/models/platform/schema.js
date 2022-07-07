const mongoose = require("mongoose");

const PlatformSchema = new mongoose.Schema({
  name: { type:String }, // 游戏名称
  img_url : { type:String }, //图片地址
  szm :{ type:String ,default :'#'}, // 首字母
  description :{type :String }, //备注
  status :{ type :Number ,default:1}, //状态 0 解除合作 1 进驻 2撤离
  create_at : { type:Date ,default:Date.now }, // 时间
  show : { type :Boolean ,default :true } ,  //  默认显示 ,删除后只修改该条数据,但不直接删除数据,用作数据统计
});


module.exports = PlatformSchema