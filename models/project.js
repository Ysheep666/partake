var _ = require('lodash');
var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var ObjectId = mongoose.Schema.ObjectId;

// 结构
var ProjectSchema = new mongoose.Schema({
  name: { // 名称
    type: String, index: true,
    es_type: 'string', es_boost: 2.0, es_analyzer : 'whitespace'
  },
  url: { // 链接地址
    type: String, default: ''
  },
  description: { // 一句话描述
    type: String, default: '',
    es_type: 'string', es_boost: 2.0, es_analyzer : 'whitespace'
  },
  agreement: {type: String, default: ''}, // 授权协议
  languages: [{type: String}], // 开发语言
  systems: [{type: String}], // 操作系统
  user: {type: ObjectId, ref: 'User'}, // 提交人
  verify: {type: Boolean, default: false}, // 是否通过审核
  online_at: {type: Date}, // 上线时间
  vote_count: {type: Number, default: 0, es_type: 'long'}, // 投票统计
  comment_count: {type: Number, default: 0, es_type: 'long'}, // 评论统计
  is_delete: {type: Boolean, default: false} // 是否已删除
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

// 插件
ProjectSchema.plugin(require('../libs/mongoose/timestamp'));
ProjectSchema.plugin(mongoosastic, _.merge({index: 'partake', type: 'project'}, PT.config.elasticsearch));

module.exports = mongoose.model('Project', ProjectSchema);
