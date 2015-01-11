var mongoose = require('mongoose');

// 结构
var UserSchema = new mongoose.Schema({
  github: {type: String, required: true}, // github id
  name: {type: String, default: ''}, // 账号
  nickname: {type: String, default: ''}, // 名称
  email: {type: String, default: ''}, // 电子邮件
  avatar: {type: String, default: ''}, // 头像
  login_count: {type: Number, default: 0} // 登陆统计
});

// 集合名称
UserSchema.set('collection', 'users');

// 序列化结果
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
UserSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('User', UserSchema);
