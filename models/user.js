var mongoose = require('mongoose');

// 结构
var UserSchema = new mongoose.Schema({
  github: {type: String, required: true}, // github id
  name: {type: String, default: ''}, // 账号
  nickname: {type: String, default: ''}, // 昵称
  email: {type: String, default: ''}, // 电子邮件
  description: {type: String, default: ''}, // 一句话描述
  avatar: {type: String, default: ''}, // 头像
  provider: {type: Boolean, default: false}, // 是否是项目提供者
  administrate: {type: Boolean, default: false}, // 是否是管理员
  login_count: {type: Number, default: 0}, // 登陆统计
  vote_count: {type: Number, default: 0}, // 投票统计
  submit_count: {type: Number, default: 0}, // 提交统计
  favorite_count: {type: Number, default: 0}, // 集合统计
  fans_count: {type: Number, default: 0}, // 粉丝统计
  follower_count: {type: Number, default: 0}, // 关注统计
  is_delete: {type: Boolean, default: false} // 是否已删除
});

// 集合名称
UserSchema.set('collection', 'user');

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
