const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: { type: String, }, //公司名
  address : {type :String }, //住址
  principal :{type :String }, //负责人
  phone :{type :String },    //电话
  status : { type: Number , default :1 } , //状态 0 合作终止 ，1合作中 2删除
  szm :{ type:String ,default :'#'}, // 首字母
  description :{type :String }, //备注
  create_at : { type:Date ,default:Date.now }, // 时间
  show : { type :Boolean ,default :true } ,  //  默认显示 ,删除后只修改该条数据,但不直接删除数据,用作数据统计
});


module.exports = CompanySchema