const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type:String }, //姓名
  wx :{ type:String }, //微信号 或者 身份证 ，最好保证唯一ID 好查就可以
  sex :{ type:Number ,default: 0 }, //0女 1男
  status : { type :Number ,default :1}, // 是否在职 0停职 1在职 2删除
  description :{ type:String },   //备注
  create_at : { type:Date ,default:Date.now }, // 时间
  show : { type :Boolean ,default :true } ,  //  默认显示 ,删除后只修改该条数据,但不直接删除数据,用作数据统计
});





module.exports = UserSchema