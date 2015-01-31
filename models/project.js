var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var ProjectSchema = new mongoose.Schema({
  name: {type: String, index: true}, // 名称
  url: {type: String, default: ''}, // 链接地址
  description: {type: String, default: ''}, // 一句话描述
  agreement: {type: String, default: ''}, // 授权协议
  languages: [{type: String}], // 开发语言
  systems: [{type: String}], // 操作系统
  user: {type: ObjectId, ref: 'User'}, // 提交人
  verify: {type: Boolean, default: false}, // 是否通过审核
  online_at: {type: Date}, // 上线时间
  vote_count: {type: Number, default: 0}, // 投票统计
  comment_count: {type: Number, default: 0} // 评论统计
});

// 集合名称
ProjectSchema.set('collection', 'project');

// 序列化结果
ProjectSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Timestamp
ProjectSchema.plugin(require('../libs/mongoose/timestamp'));

module.exports = mongoose.model('Project', ProjectSchema);
